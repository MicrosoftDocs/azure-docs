---
title: Get drone imagery
description: Describes how to get the drone imagery from the partners
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Get drone imagery from drone partners

This article describes how you can bring in orthomosaic data from your drone imagery partners in to Azure FarmBeats Data hub. An orthomosaic is an aerial illustration/image that is geometrically corrected and stitched from the data collected by drones.

Currently the following imagery partners are supported.


  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/drone-partner-1.png)

Integrating drone imagery data with Azure FarmBeats helps you get orthomosaic data from the drone flights you conduct on your farm into the Data hub. After the data is available you can view it in the FarmBeats Accelerator, and it can be used for data fusion and AI/ML model building.

## Before you begin

  - Make sure you have deployed Azure FarmBeats. To deploy, visit [Deploy FarmBeats](prepare-for-deployment.md).
  - Ensure you have the farm (for which you want drone imagery) defined in your FarmBeats system.

## Enable drone imagery integration with FarmBeats   

You need to provide the following information to your device provider to enable the integration with FarmBeats:  
 - API Endpoint  
 - Tenant ID  
 - Client ID  
 - Client Secret  

Use the following steps:

1. Download this [script](https://aka.ms/farmbeatspartnerscript) and extract it in on your local drive. You will find two files inside this ZIP file.  
2. Sign in to [Azure portal](https://portal.azure.com/) and open Cloud Shell (This option is available on the top-right bar of the portal).   

    ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/navigation-bar-1.png)

3. Ensure the environment is set to **PowerShell**

    ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/power-shell-new-1.png)

4. Upload the two files that you downloaded (from step 1 above) in your Cloud Shell.  

    ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/power-shell-two-1.png)

5. Go to the directory where the files were uploaded. (By default it gets uploaded to the home directory > username.)  
6. Run the following script:

    ```azurepowershell-interactive 

    PS> ./generateCredentials.ps1   

    ```

7. Follow the onscreen instructions to capture the values of API Endpoint, Tenant ID, Client ID, Client Secret and EventHub Connection String.

    Once you enter the required credentials into the partner’s drone software system, you will be able to import all farms from the FarmBeats system and use the Farm details to do your flight path planning and drone image collection.

    After the raw images are processed by the drone providers’ software, the drone software system uploads the stitched orthomosaic and other processed images into the Data hub.

## View drone imagery

Once the data is sent to the FarmBeats data hub, you should be able to query the Scene Store using the FarmBeats Data hub APIs.

Alternatively, you should be able to view the latest drone image in the **Farm Details** page. To view, follow the steps:  

1. Select the farm to which your imagery has been uploaded. The **Farm** details page displays.
2. Scroll down to the latest **Precision Maps** section.
3. You should be able to view the image in the **Drone Imagery** section.

    ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/drone-imagery-1.png)

## Download drone imagery

When you select the Drone Imagery section, a pop-up opens to show a high-resolution image of the drone orthomosaic.

![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/download-drone-imagery-1.png)

## View all drone maps

Files and images uploaded by the drone provider appear in the Maps section. Select the **Maps** section, filter by **Farm** and choose the appropriate files to view and download:

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/view-drone-maps-1.png)

## Next steps

Learn how to use the FarmBeats data hub [APIs](references-for-farmbeats.md#rest-api) to get your drone imagery.
