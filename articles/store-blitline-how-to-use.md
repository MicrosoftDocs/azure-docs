<properties 
	pageTitle="How to use Blitline for image processing - Azure feature guide" 
	description="Learn how to use the Blitline service to process images within an Azure application." 
	services="" 
	documentationCenter=".net" 
	authors="blitline-dev" 
	manager="jason@blitline.com" 
	editor="jason@blitline.com"/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/09/2014" 
	ms.author="support@blitline.com"/>
# How to use Blitline with Azure and Azure Storage

This guide will explain how to access Blitline services and how to submit jobs to Blitline.

## What is Blitline?

Blitline is a cloud-based image processing service that provides enterprise level image processing at a fraction of the price that it would cost to build it yourself.

The fact is that image processing has been done over and over again, usually rebuilt from the ground up for each and every website. We realize this because we’ve built them a million times too. One day we decided that perhaps it‘s time we just do it for everyone. We know how to do it, to do it fast and efficiently, and save everyone work in the meantime.

For more information, see [http://www.blitline.com](http://www.blitline.com).

## What Blitline is NOT...

To clarify what Blitline is useful for, it is often easier to identify what Blitline does NOT do before moving forward.

- Blitline does NOT have HTML widgets to upload images. You must have images available publicly or with restricted permissions available for Blitline to reach.

- Blitline does NOT do live image processing, like Aviary.com

- Blitline does NOT accept image uploads, you cannot push your images to Blitline directly. You must push them to Azure Storage or other places Blitline supports and then tell Blitline where to go get them.

- Blitline is massively parallel and does NOT do any synchronous processing. Meaning you must give us a postback_url and we can tell you when we are done processing.

## Create a Blitline account

[AZURE.INCLUDE [blitline-signup](../includes/blitline-signup.md)]

## How to create a Blitline job

Blitline uses JSON to define the actions you want to take on an image. This JSON is composed of a few simple fields.

The simplest example is as follows:

	    json : '{
       "application_id": "MY_APP_ID",
       "src" : "http://cdn.blitline.com/filters/boys.jpeg",
       "functions" : [ {
           "name": "resize_to_fit",
           "params" : { "width": 240, "height": 140 },
           "save" : { "image_identifier" : "external_sample_1" }
       } ]
    }'

Here we have JSON that will take a "src" image "...boys.jpeg" and then resize that image to 240x140.

The Application ID is something you can find in your **CONNECTION INFO** or **MANAGE** tab on Azure. It is your secret identifier that allows you to run jobs on Blitline.

The "save" parameter identifies information about where you want to put the image once we have processed it. In this trivial case, we haven't defined one. If no location is defined Blitline will store it locally (and temporarily) at a unique cloud location. You will be able to get that location from the JSON returned by Blitline when you make the Blitline. The "image" identifier is required and is returned to you when to identify this particular saved image.

You can find more information about the *functions* we support here: <http://www.blitline.com/docs/functions>

You can also find documentation about the job options here: <http://www.blitline.com/docs/api>

Once you have your JSON all you need to do is **POST** it to `http://api.blitline.com/job`

You will get JSON back that looks something like this:

    {
     "results":
         {"images":
            [{
              "image_identifier":"external_sample_1",
              "s3_url":"https://s3.amazonaws.com/dev.blitline/2011110722/YOUR_APP_ID/CK3f0xBF_2bV6wf7gEZE8w.jpg"
            }],
          "job_id":"4eb8c9f72a50ee2a9900002f"
         }
    }


This tells you that Blitline has recieved your request, it has put it in a processing queue, and when it has completed the image will be available at:
**https://s3.amazonaws.com/dev.blitline/2011110722/YOUR\_APP\_ID/CK3f0xBF_2bV6wf7gEZE8w.jpg**

## How to save an image to your Azure Storage account

If you have an Azure Storage account, you can easily have Blitline push the processed images into your Azure container. By adding an "azure_destination" you define the location and permissions for Blitline to push to.

Here is an example:

    job : '{
      "application_id": "YOUR_APP_ID",
      "src" : "http://www.google.com/logos/2011/houdini11-hp.jpg",
         "functions" : [{
         "name": "blur",
         "save" : {
             "image_identifier" : "YOUR_IMAGE_IDENTIFIER",
             "azure_destination" : {
                 "account_name" : "YOUR_AZURE_CONTAINER_NAME",
                 "shared_access_signature" : "SAS_THAT_GIVES_BLITLINE_PERMISSION_TO_WRITE_THIS_OBJECT_TO_CONTAINER",
               }
           }
         }]
       }'


By filling in the CAPITALIZED values with your own, you can submit this JSON to http://api.blitline.com/job and the "src" image will be processed with a blur filter and then pushed to you Azure destination.

###Please note:

The SAS must contain the entire SAS url, including the filename of the destination file.

Example:

    http://blitline.blob.core.windows.net/sample/image.jpg?sr=b&sv=2012-02-12&st=2013-04-12T03%3A18%3A30Z&se=2013-04-12T04%3A18%3A30Z&sp=w&sig=Bte2hkkbwTT2sqlkkKLop2asByrE0sIfeesOwj7jNA5o%3D


You can also read the latest edition of Blitline's Azure Storage docs [here](http://www.blitline.com/docs/azure_storage).


## Next Steps

Visit blitline.com to read about all our other features:

* Blitline API Endpoint Docs <http://www.blitline.com/docs/api>
* Blitline API Functions <http://www.blitline.com/docs/functions>
* Blitline API Examples <http://www.blitline.com/docs/examples>
* Third Part Nuget Library <http://nuget.org/packages/Blitline.Net>
