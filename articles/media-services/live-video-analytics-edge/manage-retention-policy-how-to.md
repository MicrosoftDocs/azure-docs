---
title: Manage retention policy - Azure
description: This topic explains how to manage retention policy.
ms.topic: how-to
ms.date: 04/27/2020

---
# Manage retention policy

You can use Live Video Analytics on IoT Edge for continuous video recording (CVR : TODO, link to that scenario page), whereby you can record video into the cloud for weeks or months. You can manage the length (in days) of that cloud archive by using the Lifecyle Management tools built into Azure storage.  

Your Media Service account is linked to an Azure Storage account, and when you record video to the cloud, the content is written to a Media Service Asset. Each asset is mapped to a container in the storage account. Lifecycle management allows you to define a Policy for a Storage account, wherein you can specify a Rule such as the following.

```
{
  "rules": [
    {
      "name": "NinetyDayRule",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": [ "blockBlob" ]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "delete": { "daysAfterModificationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}
```

The above rule:

* Applies to all block blobs in the Storage account.
* Specifies that when blobs age beyond 30 days, they are moved from the hot access tier to cool.
* And when blobs age beyond 90 days, they are to be deleted.

Since Live Video Analytics archives your video in specified units of time (see segmentLengthSeconds in TODO: link to the Direct Method document), your Asset will contain a series of blobs, one blob per segment. When Lifecycle management policy kicks in and deletes older blobs, you will continue to be able to access and playback the remaining blobs via Media Service APIs (TODO: link to playback doc). 

## Limitations

Following are some known limitations with Lifecyle management:

* You can have at most 100 rules within the policy, and each rule can specify up to 10 containers. So if you needed to have different retention policies (eg. 3-day archive for the camera facing the parking lot, 30 days for the camera in the loading dock, and 180 days for the camera behind the checkout counter), then with one Media Service account you can customize the rules for at most 1000 cameras.
* Lifecycle management policy updates are not immediate. See this section for more details.
* If you choose to apply a policy where blobs get moved to the cool tier, then playback of that portion of the archive may be affected. You may see additional latencies, or sporadic errors. Media Services does not support playback of content in the archive tier.

## Next steps

[Playback of recordings](playback-recordings-how-to.md)