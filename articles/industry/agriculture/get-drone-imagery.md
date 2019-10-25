---
title: References for FarmBeats
description:
author: uhabiba04
ms.topic: article
ms.date: 10/25/2019
ms.author: v-umha
ms.service: backup
---


# Get drone imagery from drone partners

  This article describes how you can bring in orthomosaic data from your drone imagery partners onto Azure FarmBeats Data hub. Currently the following imagery partners are supported:  

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/drone-partner.png)

  Integrating drone imagery data with Azure FarmBeats helps you get orthomosaic data from the drone flights you conduct on your farm into the Data hub. The data once available can be visualized through the FarmBeats Accelerator and can potentially be used for data fusion and AI/ML model building.

## Before you begin

  - Make sure you have deployed Azure FarmBeats. To deploy, please visit *Deploy FarmBeats*
  - Deploy device/sensors from your device partner. Make sure you can access the data via your device partners’ solution.

## Enable drone imagery integration with FarmBeats   

  You need to provide the following information to your device provider to enable the integration with FarmBeats:  
    1. API Endpoint  
    2. Tenant ID  
    3. Client ID  
    4. Client Secret  


1. Download this script (add a link here. awaiting inputs from SMEs) and extract it in on your local drive. You will find two files inside this ZIP file.  
2. Sign in to https://portal.azure.com/  and open CloudShell (This option is available on the top-right bar of the portal)   

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/navigation-bar.png)

3. Ensure the environment is set to “PowerShell”

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/power-shell-new.png)

4. Upload the two files that you downloaded (from step 1 above) in your CloudShell.  

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/power-shell-two.png)

5. Go to the directory where the files were uploaded (By default it gets uploaded to the home directory - *</home<username>*  
6. Run the script by using the following command:  
  *<./generateCredentials.ps1>*  

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/power-shell-generate-credentials.png)

7. Follow the onscreen instructions to capture the above values. (API Endpoint, Tenant ID, Client ID, Client Secret and EventHub Connection String)

  Once you enter the required credentials into the partner’s drone software system, you will be able to import all farms from the FarmBeats system and use the Farm details to do your flight path planning and drone image collection.

  After the raw images are processed by the drone providers’ software, the drone software system uploads the stitched orthomosaic & other processed images into the Data hub.

## View drone imagery

  Once the data is sent to the FarmBeats data hub, you should be able to query the Scene Store using the FarmBeats Data hub APIs

  Alternatively, you should be able to view the latest drone image in the **Farm Details** page. To do so,  

  1. Click the Farm to which your imagery has been uploaded to - The FarmDetails page displays.
  2. Scroll down to the Latest **Precision Maps** section
  3. You should be able to view the image in the “Drone Imagery” section

![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/drone-imagery.png)

## Download drone imagery

  If you click the drone Imagery section, a Popup opens, which show a high resolution image of the drone orthomosaic. Click **Download** option to download the different files associated with this particular scene.


  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/download-drone-imagery.png)


## View all drone maps

  All the files and images uploaded by the drone provider are present in the Maps section. Click the **Maps** section, filter by **Farm** and choose the appropriate files to view and download:

  ![Project Farm Beats](./media/get-drone-imagery-from-drone-partner/view-drone-maps.png)

## Next steps

Click [REST API](references-for-farmbeats.md#rest-api) to know more on REST API-based integration details
