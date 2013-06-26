# How to use Blitline with Windows Azure and Windows Azure Storage

*By Jason Malcolm, [Blitline](http://www.blitline.com)*

Blitline is a cloud-based image processing service that provides enterprise level image processing at a fraction of the price that it would cost to build it yourself. This guide explains how to access Blitline services and how to submit jobs to Blitline.

[Next steps][] section.

<h2><a name="toc"></a>Table of contents</h2>

[What is Blitline?][]   
[What Blitline is NOT][]   
[Create a Blitline account][]    
[How to create a Blitline job][]  
[How to save an image to your Windows Azure Storage][]  
[Next steps][]

<h2><a name="whatis"></a><span  class="short-header">What is Blitline?</span>What is Blitline?</h2>

The fact is that image processing has been done over and over again, usually rebuilt from the ground up for each and every web site. We realize this because we've built them a million times too. One day we decided that perhaps it's time we just do it for everyone. We know how to do it, to do it fast and efficiently, and save everyone work in the meantime.

For more information, see [http://www.blitline.com](http://www.blitline.com).

<h2><a name="whatisnot"></a><span  class="short-header">What Blitline is NOT...</span>What Blitline is NOT...</h2>

To clarify what Blitline is useful for, it is often easier to identify what Blitline does NOT do before moving forward.

- Blitline does NOT have HTML widgets to upload images. You must have images available publicly or with restricted permissions available for Blitline to reach. 

- Blitline does NOT do live image processing, like Aviary.com

- Blitline does NOT accept image uploads, you cannot push your images to Blitline directly. You must push them to Windows Azure Storage or other places Blitline supports and then tell Blitline where to go get them.

- Blitline is massively parallel and does NOT do any synchronous processing. Meaning you must give us a postback_url and we can tell you when we are done processing.

<h2><a name="createaccount"></a><span  class="short-header">Create a Blitline account</span>Create a Blitline account</h2>


### To sign up for a Blitline account

1. Log in to the [Windows Azure Management Portal](https://manage.windowsazure.com/).

2. In the lower pane of the management portal, click **New**.

	![command-bar-new][]

3. Click **Store**.

	![blitline-store][]

4. In the **Choose an Add-on** dialog, select **Blitline** and click the right arrow.

5. In the **Personalize Add-on** dialog select the **Blitline** plan you want to sign up for.

6. Enter a name to identify your **Blitline** service in your Windows Azure settings, or use the default value of **Blitline**. Names must be between 1 and 100 characters in length and contain only alphanumeric characters, dashes, dots, and underscores. The name must be unique in your list of subscribed Windows Azure Store Items.

	![store-screen-1][]

7. Choose a value for the region; for example, West US. 

8. Click the right arrow.

9. On the **Review Purchase** tab, review the plan and pricing information, and review the legal terms. If you agree to the terms, click the check mark. After you click the check mark, your Blitline account will begin the provisioning process. 


To use Blitline you need to have your Application ID.

### To find your Blitline Application ID ###

1. Click **Connection Info**.

	![blitline-connection-info-button][]

2. In the *Connection info* dialog, you can see your Application ID

	![blitline-connection-info][]

<h2><a name="createjob"></a><span  class="short-header">Create a Blitline job</span>How to: create a Blitline job</h2>

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

Here we have json that will take a "src" image "...boys.jpeg" and then resize that image to 240x140.

The Application ID is something you can find in your **CONNECTION INFO** or **MANAGE** tab on Windows Azure. It is your secret identifier that allows you to run jobs on Blitline.

The "save" parameter identifies information about where you want to put the image once we have processed it. In this trivial case, we haven't defined one. If no location is defined Blitline will store it locally (and temporarily) at a unique cloud location. You will be able to get that location from the JSON returned by Blitline when you make the Blitline. The "image" identifier is required and is returned to you when to identify this particular saved image.

You can find more information about the *functions* we support here: <http://www.blitline.com/docs/functions>

You can also find documentation about the job options here: <http://www.blitline.com/docs/api>

Once you have your JSON all you need to do is **POST** it to <http://api.blitline.com/jobs>

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

<h2><a name="saveazure"></a><span  class="short-header">How to save an image to your Windows Azure Storage</span>How to save an image to your Windows Azure Storage</h2>

If you have a Windows Azure Storage account, you can easily have Blitline push the processed images into your  container. By adding an "azure_destination" you define the location and permissions for Blitline to push to.

Here is an example:

    job : '{
      "application_id": "YOUR_APP_ID",
      "src" : "http://www.google.com/logos/2011/houdini11-hp.jpg",
         "functions" : [{
         "name": "blur",
         "save" : {
             "image_identifier" : "YOUR_IMAGE_IDENTIFIER",
             "azure_destination" : {
                 "application_name" : "YOUR_AZURE_APP",
                 "container" : "YOUR_AZURE_STORAGE_CONTAINER",
                 "key" : "KEY_VALUE_TO_SAVE_IMAGE_AS",
                 "shared_access_signature" : "SAS_THAT_GIVES_BLITLINE_PERMISSION_TO_WRITE_TO_CONTAINER",
               }
           }
         }]
       }'


By filling in the CAPITALIZED values with your own, you can submit this JSON to http://api.blitline.com/job and the "src" image will be processed with a blur filter and then pushed to you Windows Azure destination.

<h2><a name="nextsteps"></a><span  class="short-header">Next Steps</span>Next Steps</h2>

Visit blitline.com to read about all our other features:

* [Blitline API Endpoint Docs](http://www.blitline.com/docs/api)
* [Blitline API Functions](http://www.blitline.com/docs/functions)
* [Blitline API Examples](http://www.blitline.com/docs/examples)
* [NuGet Library](http://nuget.org/packages/Blitline.Net)


  [Next steps]: #nextsteps
  [What is Blitline?]: #whatis
  [What Blitline is NOT]: #whatisnot
  [Create a Blitline account]: #createaccount
  [How to create a Blitline job]: #createjob
  [How to save an image to your Windows Azure Storage]: #saveazure
  [command-bar-new]: ../media/blitline_bar_new.png
  [blitline-store]: ../media/blitline_offerings_store.png
  [store-screen-1]: ../media/blitline_purchase.jpg
  [blitline-connection-info-button]: ../media/blitline_connection_info_button.png
  [blitline-connection-info]: ../media/blitline_connection_info_screen.jpeg
