## Update properties

To update the properties on an anchor, you use the `UpdateAnchorProperties()` method. If two or more devices try to update properties for the same anchor at the same time, we use an optimistic concurrency model. Which means that the first write will win.  All other writes will get a "Concurrency" error: a refresh of the properties would be needed before trying again.
