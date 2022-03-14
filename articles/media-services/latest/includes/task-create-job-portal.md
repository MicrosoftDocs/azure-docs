---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 03/01/2022
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services job portal-->

### Create a job

1. Select **Add job**. The Create a job screen will appear.
1. For the **Input source**, the **Asset** radio button should be selected by default.  If not, select it now.
1. Select **Select an existing asset**. The Select an asset screen will appear.
1. Select one of the assets in the list. You can only select one at a time for the job.
1. Select the **Use existing** radio button.
1. Select a transform from the **Transform** dropdown list.
1. Under Configure output, default settings will be autopopulated. You can leave them as they are or change them.
1. Select **Create**.
1. Select **Transforms + Jobs**.
1. You'll see the name of the transform you chose for the job. Select the transform to see the status of the job.
1. Select the job listed under **Name** in the table of jobs. The job detail screen will open.
1. Select the output asset from the **Outputs** list. The asset screen will open.
1. Select the link for the asset next to Storage container.  A new browser tab will open and You'll see the results of the job that used the transform.  There should be several files in the output asset including:
    1. Encoded video files with.mpi and .mp4 extensions.
    1. A *XXXX_metadata.json* file.
    1. A *XXXX_manifest.json* file.
    1. A *XXXX_.ism* file.
    1. A *XXXX.isc* file.
    1. A *ThumbnailXXXX.jpg* file.
