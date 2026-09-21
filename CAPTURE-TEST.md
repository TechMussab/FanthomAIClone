# Capture Test - 8x Assignment

## Tool and Model
- **Tool**: Claude Code
- **Model**: Claude Opus (`claude[1m]`)

## Mechanism Used
- **Hook system**: Claude Code's lifecycle hooks in `.claude/settings.json`
- **Config file**: `.claude/settings.json`
- **Events captured**: 
  - `onPrompt` - fires when user submits a prompt
  - `onTurnEnd` - fires when Claude completes a response
- **Capture script**: `.claude/capture.ps1` (PowerShell)

## Configuration
Added hooks to `.claude/settings.json`:
```json
{
  "hooks": {
    "onPrompt": {
      "command": "powershell",
      "args": ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ".claude/capture.ps1", "-EventType", "onPrompt"],
      "captureStdin": true
    },
    "onTurnEnd": {
      "command": "powershell",
      "args": ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ".claude/capture.ps1", "-EventType", "onTurnEnd"],
      "captureStdin": true
    }
  }
}
```

## Log File Path
Logs will be written to: `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md`

## Canary Test - First Session
**Status**: Pending - awaiting first test prompt

## Canary Test - Second Session
**Status**: Pending - awaiting second session test

## What I Tried First
1. ✅ Checked if `.claude/settings.json` existed (it didn't)
2. ✅ Created `.agent-logs/` directory
3. ✅ Created PowerShell capture script at `.claude/capture.ps1`
4. ✅ Created `.claude/settings.json` with onPrompt and onTurnEnd hooks

## Next Steps
1. This session needs to end for the hooks to take effect
2. Start a new session and send canary prompt: `CAPTURE TEST — 8x assignment, TechMussab`
3. Verify both prompt and response appear in `.agent-logs/`
4. Start a third session, send another canary, verify it lands
5. Update this file with the canary entries once verified
