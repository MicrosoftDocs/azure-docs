---
title: Get started using the Java SDK for Azure Media Services | Microsoft Docs
description: This tutorial walks you through the steps of implementing a basic Video-on-Demand (VoD) content delivery service with Azure Media Services (AMS) application using Java.
services: media-services
documentationcenter: java
author: juliako
manager: femila
editor: johndeu

ms.assetid: b884bd61-dbdb-42ea-b170-8fb02e7fded7
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: get-started-article
ms.date: 09/18/2018
ms.author: juliako

---
# Get started with the Java client SDK for Azure Media Services
[!INCLUDE [media-services-selector-get-started](../../../includes/media-services-selector-get-started.md)]

This tutorial walks you through the steps of implementing a basic video content delivery service with Azure Media Services using the Java client SDK.

## Prerequisites

The following are required to complete this tutorial:

* An Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* A Media Services account. To create a Media Services account, see [How to Create a Media Services Account](media-services-portal-create-account.md).
* The current [Azure Media Services Java SDK](https://mvnrepository.com/artifact/com.microsoft.azure/azure-media/latest)

## How to: Import the Azure Media Services Java client SDK package

To start using the Media Services SDK for Java, add a reference to the current version (0.9.8) of the `azure-media` package from the [Azure Media Services Java SDK](https://mvnrepository.com/artifact/com.microsoft.azure/azure-media/latest)

For example, if your build tool is `gradle`, add the following dependency to your `build.gradle` file:

    compile group: 'com.microsoft.azure', name: 'azure-media', version: '0.9.8'

>[!IMPORTANT]
>Starting with `azure-media` package version `0.9.8`, the SDK added support for Azure Active Directory (AAD) authentication and removed support for  Azure Access Control Service (ACS) authentication. We recommend that you migrate to the Azure AD authentication model as soon as possible. For details on migration,  read the article [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md).

>[!NOTE]
>You can find the source code of the Azure Media Services Java SDK in our [GitHub repository](https://github.com/Azure/azure-sdk-for-java/tree/0.9/services/azure-media). Make sure to switch to the 0.9 branch, and not the master branch. 

## How to: Use Azure Media Services with Java

>[!NOTE]
>When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state.

The following code shows how to create an asset, upload a media file to the asset, run a job with a task to transform the asset, and create a locator to stream your video.

Set up a Media Services account before using this code. For information about setting up an account, see [How to Create a Media Services Account](media-services-portal-create-account.md).

The code connects to the Azure Media Services API using Azure AD service principal authentication. Create an Azure AD application and specify the values for the following variables in the code:
* `tenant`: The Azure AD tenant domain where the Azure AD application resides
* `clientId`: The client ID of the Azure AD application
* `clientKey`: The client key of the Azure AD application
* `restApiEndpoint`: The REST API endpoint of the Azure Media Services account

You can create an Azure AD application and obtain the preceding configuration values from the Azure portal. For more information, see the **Service principal authentication** section of [Getting started with Azure AD authentication using the Azure portal](https://docs.microsoft.com/azure/media-services/media-services-portal-get-started-with-aad).

The code also relies on a locally stored video file. You must edit the code to provide your own local file to upload.

```java
    import java.io.*;
    import java.net.URI;
    import java.security.NoSuchAlgorithmException;
    import java.util.EnumSet;
    import java.util.concurrent.ExecutorService;
    import java.util.concurrent.Executors;

    import com.microsoft.windowsazure.Configuration;
    import com.microsoft.windowsazure.exception.ServiceException;
    import com.microsoft.windowsazure.services.media.MediaConfiguration;
    import com.microsoft.windowsazure.services.media.MediaContract;
    import com.microsoft.windowsazure.services.media.MediaService;
    import com.microsoft.windowsazure.services.media.WritableBlobContainerContract;
    import com.microsoft.windowsazure.services.media.authentication.AzureAdClientSymmetricKey;
    import com.microsoft.windowsazure.services.media.authentication.AzureAdTokenCredentials;
    import com.microsoft.windowsazure.services.media.authentication.AzureAdTokenProvider;
    import com.microsoft.windowsazure.services.media.authentication.AzureEnvironments;
    import com.microsoft.windowsazure.services.media.models.AccessPolicy;
    import com.microsoft.windowsazure.services.media.models.AccessPolicyInfo;
    import com.microsoft.windowsazure.services.media.models.AccessPolicyPermission;
    import com.microsoft.windowsazure.services.media.models.Asset;
    import com.microsoft.windowsazure.services.media.models.AssetFile;
    import com.microsoft.windowsazure.services.media.models.AssetFileInfo;
    import com.microsoft.windowsazure.services.media.models.AssetInfo;
    import com.microsoft.windowsazure.services.media.models.Job;
    import com.microsoft.windowsazure.services.media.models.JobInfo;
    import com.microsoft.windowsazure.services.media.models.JobState;
    import com.microsoft.windowsazure.services.media.models.ListResult;
    import com.microsoft.windowsazure.services.media.models.Locator;
    import com.microsoft.windowsazure.services.media.models.LocatorInfo;
    import com.microsoft.windowsazure.services.media.models.LocatorType;
    import com.microsoft.windowsazure.services.media.models.MediaProcessor;
    import com.microsoft.windowsazure.services.media.models.MediaProcessorInfo;
    import com.microsoft.windowsazure.services.media.models.Task;

    public class Program
    {
        // Media Services account credentials configuration
        private static String tenant = "tenant.domain.com";
        private static String clientId = "<client id>";
        private static String clientKey = "<client key>";
        private static String restApiEndpoint = "https://account_name.restv2.region_name.media.azure.net/api/";

        // Media Services API
        private static MediaContract mediaService;

        // Encoder configuration
        // This is using the default Adaptive Streaming encoding preset. 
        // You can choose to use a custom preset, or any other sample defined preset. 
        // In addition you can use other processors, like Speech Analyzer, or Redactor if desired.
        private static String preferedEncoder = "Media Encoder Standard";
        private static String encodingPreset = "Adaptive Streaming";

        public static void main(String[] args)
        {
            ExecutorService executorService = Executors.newFixedThreadPool(1);

            try {
                // Setup Azure AD Service Principal Symmetric Key Credentials
                AzureAdTokenCredentials credentials = new AzureAdTokenCredentials(
                        tenant,
                        new AzureAdClientSymmetricKey(clientId, clientKey),
                        AzureEnvironments.AZURE_CLOUD_ENVIRONMENT);

                AzureAdTokenProvider provider = new AzureAdTokenProvider(credentials, executorService);

                // Create a new configuration with the credentials
                Configuration configuration = MediaConfiguration.configureWithAzureAdTokenProvider(
                        new URI(restApiEndpoint),
                        provider);

                // Create the media service provisioned with the new configuration
                mediaService = MediaService.create(configuration);

                // Upload a local file to an Asset
                AssetInfo uploadAsset = uploadFileAndCreateAsset("Video Name", "C:/path/to/video.mp4");
                System.out.println("Uploaded Asset Id: " + uploadAsset.getId());

                // Transform the Asset
                AssetInfo encodedAsset = encode(uploadAsset);
                System.out.println("Encoded Asset Id: " + encodedAsset.getId());

                // Create the Streaming Origin Locator
                String url = getStreamingOriginLocator(encodedAsset);

                System.out.println("Origin Locator URL: " + url);
                System.out.println("Sample completed!");

            } catch (ServiceException se) {
                System.out.println("ServiceException encountered.");
                System.out.println(se.toString());
            } catch (Exception e) {
                System.out.println("Exception encountered.");
                System.out.println(e.toString());
            } finally {
                executorService.shutdown();
            }
        }

        private static AssetInfo uploadFileAndCreateAsset(String assetName, String fileName)
            throws ServiceException, FileNotFoundException, NoSuchAlgorithmException {

            WritableBlobContainerContract uploader;
            AssetInfo resultAsset;
            AccessPolicyInfo uploadAccessPolicy;
            LocatorInfo uploadLocator = null;

            // Create an Asset
            resultAsset = mediaService.create(Asset.create().setName(assetName).setAlternateId("altId"));
            System.out.println("Created Asset " + fileName);

            // Create an AccessPolicy that provides Write access for 15 minutes
            uploadAccessPolicy = mediaService
                .create(AccessPolicy.create("uploadAccessPolicy", 15.0, EnumSet.of(AccessPolicyPermission.WRITE)));

            // Create a Locator using the AccessPolicy and Asset
            uploadLocator = mediaService
                .create(Locator.create(uploadAccessPolicy.getId(), resultAsset.getId(), LocatorType.SAS));

            // Create the Blob Writer using the Locator
            uploader = mediaService.createBlobWriter(uploadLocator);

            File file = new File(fileName);

            // The local file that will be uploaded to your Media Services account
            InputStream input = new FileInputStream(file);

            System.out.println("Uploading " + fileName);

            // Upload the local file to the media asset
            uploader.createBlockBlob(file.getName(), input);

            // Inform Media Services about the uploaded files
            mediaService.action(AssetFile.createFileInfos(resultAsset.getId()));
            System.out.println("Uploaded Asset File " + fileName);

            mediaService.delete(Locator.delete(uploadLocator.getId()));
            mediaService.delete(AccessPolicy.delete(uploadAccessPolicy.getId()));

            return resultAsset;
        }

        // Create a Job that contains a Task to transform the Asset
        private static AssetInfo encode(AssetInfo assetToEncode)
            throws ServiceException, InterruptedException {

            // Retrieve the list of Media Processors that match the name
            ListResult<MediaProcessorInfo> mediaProcessors = mediaService
                            .list(MediaProcessor.list().set("$filter", String.format("Name eq '%s'", preferedEncoder)));

            // Use the latest version of the Media Processor
            MediaProcessorInfo mediaProcessor = null;
            for (MediaProcessorInfo info : mediaProcessors) {
                if (null == mediaProcessor || info.getVersion().compareTo(mediaProcessor.getVersion()) > 0) {
                    mediaProcessor = info;
                }
            }

            System.out.println("Using Media Processor: " + mediaProcessor.getName() + " " + mediaProcessor.getVersion());

            // Create a task with the specified Media Processor
            String outputAssetName = String.format("%s as %s", assetToEncode.getName(), encodingPreset);
            String taskXml = "<taskBody><inputAsset>JobInputAsset(0)</inputAsset>"
                    + "<outputAsset assetCreationOptions=\"0\"" // AssetCreationOptions.None
                    + " assetName=\"" + outputAssetName + "\">JobOutputAsset(0)</outputAsset></taskBody>";

            Task.CreateBatchOperation task = Task.create(mediaProcessor.getId(), taskXml)
                    .setConfiguration(encodingPreset).setName("Encoding");

            // Create the Job; this automatically schedules and runs it.
            Job.Creator jobCreator = Job.create()
                    .setName(String.format("Encoding %s to %s", assetToEncode.getName(), encodingPreset))
                    .addInputMediaAsset(assetToEncode.getId()).setPriority(2).addTaskCreator(task);
            JobInfo job = mediaService.create(jobCreator);

            String jobId = job.getId();
            System.out.println("Created Job with Id: " + jobId);

            // Check to see if the Job has completed
            checkJobStatus(jobId);
            // Done with the Job

            // Retrieve the output Asset
            ListResult<AssetInfo> outputAssets = mediaService.list(Asset.list(job.getOutputAssetsLink()));
            return outputAssets.get(0);
        }


        public static String getStreamingOriginLocator(AssetInfo asset) throws ServiceException {
            // Get the .ISM AssetFile
            ListResult<AssetFileInfo> assetFiles = mediaService.list(AssetFile.list(asset.getAssetFilesLink()));
            AssetFileInfo streamingAssetFile = null;
            for (AssetFileInfo file : assetFiles) {
                if (file.getName().toLowerCase().endsWith(".ism")) {
                    streamingAssetFile = file;
                    break;
                }
            }

            AccessPolicyInfo originAccessPolicy;
            LocatorInfo originLocator = null;

            // Create a 30-day read only AccessPolicy
            double durationInMinutes = 60 * 24 * 30;
            originAccessPolicy = mediaService.create(
                    AccessPolicy.create("Streaming policy", durationInMinutes, EnumSet.of(AccessPolicyPermission.READ)));

            // Create a Locator using the AccessPolicy and Asset
            originLocator = mediaService
                    .create(Locator.create(originAccessPolicy.getId(), asset.getId(), LocatorType.OnDemandOrigin));

            // Create a Smooth Streaming base URL
            return originLocator.getPath() + streamingAssetFile.getName() + "/manifest";
        }

        private static void checkJobStatus(String jobId) throws InterruptedException, ServiceException {
            boolean done = false;
            JobState jobState = null;
            while (!done) {
                // Sleep for 5 seconds
                Thread.sleep(5000);

                // Query the updated Job state
                jobState = mediaService.get(Job.get(jobId)).getState();
                System.out.println("Job state: " + jobState);

                if (jobState == JobState.Finished || jobState == JobState.Canceled || jobState == JobState.Error) {
                    done = true;
                }
            }
        }
    }
```

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Additional Resources
For more information about developing Java apps on Azure, see [Azure Java Developer Center][Azure Java Developer Center] and [Azure for Java developers][Azure for Java developers].


For Media Services Javadoc documentation, see [Azure Libraries for Java documentation][Azure Libraries for Java documentation].

<!-- URLs. -->

[Azure Media Services SDK Maven Package]: https://mvnrepository.com/artifact/com.microsoft.azure/azure-media/latest
[Azure Java Developer Center]: http://azure.microsoft.com/develop/java/
[Azure for Java developers]: https://docs.microsoft.com/java/azure/
[Media Services Client Development]: http://msdn.microsoft.com/library/windowsazure/dn223283.aspx

