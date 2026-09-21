# Capture script for 8x assignment
# Runs on onPrompt and onTurnEnd hooks

param(
    [string]$EventType,
    [string]$TranscriptPath
)

$LogDir = ".agent-logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Force $LogDir | Out-Null
}

# Generate session ID if not in environment
if (-not $env:CLAUDE_SESSION_ID) {
    $env:CLAUDE_SESSION_ID = [guid]::NewGuid().ToString()
}

$SessionId = $env:CLAUDE_SESSION_ID
$SessionIdShort = $SessionId.Substring(0, 8)

# Determine log file name (YYYY-MM-DD_HH-MM-SS_<session-id>.md)
$Now = [System.DateTime]::UtcNow
$LogFileName = $Now.ToString("yyyy-MM-dd_HH-mm-ss") + "_$SessionId.md"
$LogPath = Join-Path $LogDir $LogFileName

# Initialize log file with header if it doesn't exist
if (-not (Test-Path $LogPath)) {
    $Header = @"
---
session_id: $SessionId
date: $($Now.ToString("yyyy-MM-dd"))
author: TechMussab
model: claude-opus-5
tool: claude-code
project: FanthomAIClone
total_exchanges: 0
first_prompt_time: $($Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
last_prompt_time:
---

# Session Log - $($Now.ToString("yyyy-MM-dd"))

Session: \`$SessionIdShort\` | Project: \`FanthomAIClone\` | Author: \`TechMussab\`

---

"@
    Add-Content -Path $LogPath -Value $Header -Encoding UTF8
}

# Handle the event
if ($EventType -eq "onPrompt") {
    # Read the prompt from stdin
    $Prompt = @()
    while ($null -ne ($Line = Read-Host)) {
        $Prompt += $Line
    }
    $PromptText = $Prompt -join "`n"

    # Extract prompt number from current log
    $LogContent = Get-Content $LogPath -Raw
    $PromptCount = ([regex]::Matches($LogContent, 'type=PROMPT').Count) + 1

    $Entry = @"

[LOG_ENTRY type=PROMPT num=$PromptCount session=$SessionIdShort]
timestamp: $($Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
model: claude-opus-5

$PromptText

"@

    Add-Content -Path $LogPath -Value $Entry -Encoding UTF8

} elseif ($EventType -eq "onTurnEnd") {
    # Read transcript from the provided path
    if ($TranscriptPath -and (Test-Path $TranscriptPath)) {
        $Transcript = Get-Content $TranscriptPath -Raw

        # Extract the final response (last assistant message)
        # This is a simplified extraction; adjust based on transcript format
        $Response = $Transcript

        $LogContent = Get-Content $LogPath -Raw
        $ResponseCount = ([regex]::Matches($LogContent, 'type=RESPONSE').Count) + 1

        $Entry = @"

[LOG_ENTRY type=RESPONSE num=$ResponseCount session=$SessionIdShort]
timestamp: $($Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))
model: claude-opus-5

$Response

"@

        Add-Content -Path $LogPath -Value $Entry -Encoding UTF8
    }
}
