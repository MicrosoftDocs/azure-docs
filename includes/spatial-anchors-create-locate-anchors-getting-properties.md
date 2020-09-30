You can't update the location of an anchor once it has been created on the service - you must create a new anchor and delete the old one to track a new position.

If you don't need to locate an anchor to update its properties, you can use the `GetAnchorPropertiesAsync()` method, which returns a `CloudSpatialAnchor` object with properties.
