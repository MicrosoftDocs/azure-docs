---
title: 'Quickstart: Create an Object Understanding model to be used in an app'
description: In this quickstart, you learn how to create an Object Understanding model from a 3D model.
author: craigktreasure
manager: virivera

ms.author: crtreasu
ms.date: 04/01/2020
ms.topic: quickstart
ms.service: azure-object-understanding
---
# Quickstart: Create an Object Understanding model from a 3D model

Azure Object Understanding is a managed cloud service that converts 3D models into AI models that enable object-aware mixed reality experiences for the HoloLens. This quickstart covers how to create an Object Understanding model from a 3D model using the C#/.NET Core SDK.

You'll learn how to:

> [!div class="checklist"]
> * Create an Object Understanding account
> * Ingest a 3D model to create an Object Understanding model

## Prerequisites

To complete this quickstart, make sure you have:

* A Windows machine with <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2019</a>.
* <a href="https://git-scm.com" target="_blank">Git for Windows</a>.
* The <a href="https://dotnet.microsoft.com/download/dotnet-core/3.1">.NET Core 3.1 SDK</a>.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create an Object Understanding account

First, you need to create an account with the Object Understanding service.

1. Go to the [Azure portal](https://portal.azure.com/)

2. Search for the **Object Understanding** resource.

   :::image type="content" source="./media/search-ou-resource.png" alt-text="Search OU Resource":::

   Select **Object Understanding** on the results page.

   :::image type="content" source="./media/select-ou-resource.png" alt-text="Select OU Resource":::

   Select **Create** to begin creating the resource.

   :::image type="content" source="./media/create-ou-resource-1.png" alt-text="Select OU Resource":::

3. In the **Object Understanding Account** dialog box:
    * Enter a unique, alphanumeric resource name.
    * Select the subscription you want to attach the resource to.
    * Create or use an existing resource group.
    * Select the region you'd like your resource to exist in.

    :::image type="content" source="./media/create-ou-resource-2.png" alt-text="Create OU Resource":::

4. Once your resource has been created, navigate to the overview page and take note of the **Account ID**. You'll need it later.

   :::image type="content" source="./media/copy-ou-account-id.png" alt-text="Copy Account ID":::

   Go to **Keys** and take note of the **Primary Key**. You'll need it later.

   :::image type="content" source="./media/copy-ou-primary-key.png" alt-text="Copy Account Key":::
   
   Go to **Properties** and take note of the **Location ID**. You'll need it later.

   :::image type="content" source="./media/copy-ou-account-region.png" alt-text="Copy Account Region":::

## Get the sample project

[!INCLUDE [Clone Sample Repo](../../../includes/object-understanding-clone-sample-repository.md)]

## Ingest a 3D model

Now, you can go ahead and ingest your 3D model.

1. Open `quickstarts/ingestion/Ingestion.sln` in Visual Studio. This solution contains a C# console project.

2. Open the `Configuration.cs` file located in the root of the project and replace the `set-me` values on following fields:

    | Field                          | Description                                                           |
    | ---                            | ---                                                                   |
    | AccountId                      | The **Account ID** of the Object Understanding Account created above. |
    | AccountKey                     | The **Primary key** of the Object Understanding Account created above |
    | Account Region                 | The **Location ID** of the Object Understanding Account created above.     |

   There are four additional fields that need to be verified:

    | Field                    | Description                       |
    | ---                      | ---                               |
    | InputAssetPath                 | Absolute path to a 3D model on your local machine (there's a sample model in `assets/models` folder you can use). Supported file formats are `fbx`, `ply`, `obj`, `glb`, and `gltf`. |
    | Unit                     | The unit of measurement of your 3D model. All the supported units of measurement can be accessed using the `Microsoft.Azure.ObjectUnderstanding.Ingestion.Unit` enumeration. |
    | Gravity                  | The direction of the gravity vector of the 3D model. This 3D vector gives the downward direction in the coordinate system of your model. For example if negative `y` represents the downward direction in the model's 3D space, this value would be `Vector3(0.0f, -1.0f, 0.0f)`. |

3. Build and run the project to upload your 3D model, register a new ingestion job with the service, and wait for it to be completed. Once the job is completed, the Object Understanding model will be downloaded either next to the file specified in the `InputAssetPath` or the path specified in `OutputModelDirectoryPath`. You should see something similar to the following console output:

   ```shell
    Successfully created model ingestion job. Job ID: ******************************
    Waiting for job completion...
    Model ingestion job completed successfully.
   ```

   Make a note of the **Job ID** for future reference. It may be useful when debugging or troubleshooting.

4. Once the job is completed successfully, you should see file with the format `<Model-Filename-Without-Extension>_<JobID>.ou` in the specified output location. For example, if your 3D model filename is `chair.ply` and your job ID is `00000000-0000-0000-0000-000000000000` then the filename the service outputs will be `chair_00000000-0000-0000-0000-000000000000.ou`.

[!INCLUDE [Clean-up section](../../../includes/clean-up-section-portal.md)]

## Next steps

In this quickstart, you created an Object Understanding account and ingested a 3D model to create an Object Understanding model. To learn how to integrate that model with the Object Understanding SDK in your mixed reality app, continue with any of the following articles:

> [!div class="nextstepaction"]
> [Unity HoloLens](get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity HoloLens with MRTK](get-started-unity-hololens-mrtk.md)

> [!div class="nextstepaction"]
> [HoloLens DirectX](get-started-hololens-directx.md)
