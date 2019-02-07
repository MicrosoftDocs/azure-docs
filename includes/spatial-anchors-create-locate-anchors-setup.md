## Setting up the library

Invoke Start() to enable your session to process environment data.

To handle events raised by your session:

- In C#, Java and C++, attach an event handler.
- In Objective-C and Swift, set the `delegate` property of your session to an object, like your view. This object must implement the SSCCloudSpatialAnchorSessionDelegate protocol.
