## Pause, reset, or stop the session

To stop the session temporarily, you can invoke `Stop()`. Doing so will stop any watchers and environment processing, even if you invoke `ProcessFrame()`. You can then invoke `Start()` to resume processing. When resuming, environment data already captured in the session is maintained.
