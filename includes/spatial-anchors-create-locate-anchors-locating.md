## Locate a cloud spatial anchor

Being able to locate a previously uploaded cloud spatial anchor is one of the prime reasons for using the Azure Spatial Anchors library. To locate cloud spatial anchors, you'll need to know their identifiers. Anchor IDs can be stored in your application's back-end service, and accessible to all devices that can properly authenticate to it. For an example of this see [Tutorial: Share Spatial Anchors across devices](/azure/spatial-anchors/tutorials/tutorial-share-anchors-across-devices/).

Instantiate an `AnchorLocateCriteria` object, set the identifiers you're looking for, and invoke the `CreateWatcher` method on the session by providing your `AnchorLocateCriteria`.
