---
title: Manage recording policy with Azure Video Analyzer
description: This topic explains how to manage recording policy with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 06/01/2021

---
# Manage recording policy with Video Analyzer

You can use Azure Video Analyzer for [recording](video-recording.md) live video into the cloud over a period of weeks, months, or years. This recording can either be [continuous](continuous-video-recording.md), or it can be sparse or [event-based](event-based-video-recording-concept.md). In either case, the recordings can span years. You can manage the length (in days) of that cloud archive by using the [Lifecycle Management tools](../../storage/blobs/storage-lifecycle-management-concepts.md?tabs=azure-portal) built into Azure storage.  

Your Video Analyzer account is linked to an Azure Storage account, and when you record to a video resource, the media data is written to a container in the storage account. Lifecycle management allows you to define a [policy](../../storage/blobs/storage-lifecycle-management-concepts.md?tabs=azure-portal#policy) for a Storage account, wherein you can specify a [rule](../../storage/blobs/storage-lifecycle-management-concepts.md?tabs=azure-portal#rules) such as the following.

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
* Specifies that when blobs age beyond 30 days, they are moved from the [hot access tier to cool](../../storage/blobs/storage-blob-storage-tiers.md?tabs=azure-portal).
* And when blobs age beyond 90 days, they are to be deleted.

When you use Video Analyzer to record to a video resource, you specify a `segmentLength` property that specifies the minimum duration of video (in seconds) to be aggregated before it's written to the storage account. Your video resource will contain a series of segments, each with a creation timestamp that is `segmentLength` newer than the previous. When the lifecycle management policy kicks in, it deletes segments older than the specified threshold. However, you will continue to be able to access and play back the remaining segments via Video Analyzer APIs. For more information, see [play back recordings](playback-recordings-how-to.md). 

## Limitations

Following are some known limitations with lifecycle management:

* You can have at most 100 rules within the policy, and each rule can specify up to 10 containers. So if you needed to have different recording policies (for example, 3-day archive for the camera facing the parking lot, 30 days for the camera in the loading dock, and 180 days for the camera behind the checkout counter), then with one storage account you can customize the rules for at most 1000 cameras.
* Lifecycle management policy updates are not immediate. See [this FAQ section](../../storage/blobs/storage-lifecycle-management-concepts.md?tabs=azure-portal#faq) for more details.
* If you choose to apply a policy where blobs get moved to the cool tier, then playback of that portion of the archive may be affected. You may see additional latencies or sporadic errors. Video Analyzer does not support playback of content in the archive tier.

## Next steps

[Playback of recordings](playback-recordings-how-to.md)
