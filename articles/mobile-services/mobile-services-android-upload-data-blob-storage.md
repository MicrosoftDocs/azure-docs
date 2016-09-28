<properties
	pageTitle="Use Mobile Services to upload images to blob storage (Android) | Mobile Services"
	description="Learn how to use Mobile Services to upload images to Azure Storage and access the images from your Android app."
	services="mobile-services"
	documentationCenter="android"
	authors="RickSaling"
	manager="erikre"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="ricksal"/>

# Upload images to Azure Storage from an Android  device

[AZURE.INCLUDE [mobile-services-selector-upload-data-blob-storage](../../includes/mobile-services-selector-upload-data-blob-storage.md)]

&nbsp;&nbsp;

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

This topic shows how to enable your Android Azure Mobile Services app to upload images to Azure Storage.

Mobile Services uses a SQL Database to store data. However, it's more efficient to store binary large object (BLOB) data in Azure Storage. In this tutorial you enable the Mobile Services quickstart app to take pictures with the Android camera, and upload the images to Azure Storage.


## What you need to get started

Before you start this tutorial, you must first complete the Mobile Services quickstart: [Get started with Mobile Services].

This tutorial also requires the following:

+ An [Azure Storage account](../storage/storage-create-storage-account.md)
+ An Android device with a camera

## How the app works

Uploading the photo image is a multistep process:

- First you take a photo, and insert a TodoItem row into the SQL database that contains  new meta-data fields used by Azure Storage.
- A new mobile service SQL **insert** script asks Azure Storage for a Shared Access Signature (SAS).
- That script returns the SAS and a URI for the blob to the client.
- The client uploads the photo, using the SAS and blob URI.

So what is a SAS?

It's not safe to store the credentials needed to upload data to the Azure Storage service inside your client app. Instead, you store these credentials in your mobile service and use them to generate a Shared Access Signature (SAS) that grants permission to upload a new image. The SAS, a credential with a 5 minute expiration, is returned securely by Mobile Services to the client app. The app then uses this temporary credential to upload the image. For more information, see [Shared Access Signatures, Part 1: Understanding the SAS Model](../storage/storage-dotnet-shared-access-signature-part-1.md)

## Code Sample
[Here](https://github.com/Azure/mobile-services-samples/tree/master/UploadImages) is the completed client source code part of this app. To run it you must complete the Mobile Services backend parts of this tutorial.

## Update the registered insert script in the Azure classic portal

[AZURE.INCLUDE [mobile-services-configure-blob-storage](../../includes/mobile-services-configure-blob-storage.md)]


## Update the quickstart app to capture and upload images.

### Reference the Azure Storage Android client library

1. To add the reference to the library, in the **app** > **build.gradle** file, add this line to the `dependencies` section:

		compile 'com.microsoft.azure.android:azure-storage-android:0.6.0@aar'


2. Change the `minSdkVersion` value to 15 (required by the camera API).

3. Press the **Sync Project with Gradle Files** icon.

### Update the manifest file for camera and storage

1. Specify your app requires having a camera available by adding this line to **AndroidManifest.xml**:

	    <uses-feature android:name="android.hardware.camera"
	        android:required="true" />

2. Specify your app needs permission to write to external storage by adding this line to **AndroidManifest.xml**:

	    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

	Note that Android external storage is not necessarily an SD card: for more see [Saving Files](http://developer.android.com/training/basics/data-storage/files.html).

### Update resource files for the new user interface

1. Add titles for new buttons by adding the following to the **strings.xml** file in the *values* directory:

	    <string name="preview_button_text">Take Photo</string>
	    <string name="upload_button_text">Upload</string>

2. In the **activity_to_do.xml** file in the **res => layout** folder,  add this code before the existing code for the **Add** button.

         <Button
             android:id="@+id/buttonPreview"
             android:layout_width="120dip"
             android:layout_height="wrap_content"
             android:onClick="takePicture"
             android:text="@string/preview_button_text" />

3. Replace the **Add** button element with the following code:

         <Button
             android:id="@+id/buttonUpload"
             android:layout_width="100dip"
             android:layout_height="wrap_content"
             android:onClick="uploadPhoto"
             android:text="@string/upload_button_text" />


### Add code for photo capture

1. In **ToDoActivity.java** add this code to create a **File** object with a unique name.

		// Create a File object for storing the photo
	    private File createImageFile() throws IOException {
	        // Create an image file name
	        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	        String imageFileName = "JPEG_" + timeStamp + "_";
	        File storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
	        File image = File.createTempFile(
	                imageFileName,  /* prefix */
	                ".jpg",         /* suffix */
	                storageDir      /* directory */
	        );
	        return image;
	    }

5. Add this code to start the Android camera app. You can then take pictures, and when one looks OK, press **Save**, which will store it in the file you just created.

		// Run an Intent to start up the Android camera
	    static final int REQUEST_TAKE_PHOTO = 1;
	    public Uri mPhotoFileUri = null;
	    public File mPhotoFile = null;

	    public void takePicture(View view) {
	        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
	        // Ensure that there's a camera activity to handle the intent
	        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
	            // Create the File where the photo should go
	            try {
	                mPhotoFile = createImageFile();
	            } catch (IOException ex) {
	                // Error occurred while creating the File
	                //
	            }
	            // Continue only if the File was successfully created
	            if (mPhotoFile != null) {
	                mPhotoFileUri = Uri.fromFile(mPhotoFile);
	                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, mPhotoFileUri);
	                startActivityForResult(takePictureIntent, REQUEST_TAKE_PHOTO);
	            }
	        }
	    }

### Add code to upload photo file to blob storage


1. First we add some new meta-data fields to the `ToDoItem` object by adding this code to **ToDoItem.java**.

		/**
	     *  imageUri - points to location in storage where photo will go
	     */
	    @com.google.gson.annotations.SerializedName("imageUri")
	    private String mImageUri;

	    /**
	     * Returns the item ImageUri
	     */
	    public String getImageUri() {
	        return mImageUri;
	    }

	    /**
	     * Sets the item ImageUri
	     *
	     * @param ImageUri
	     *            Uri to set
	     */
	    public final void setImageUri(String ImageUri) {
	        mImageUri = ImageUri;
	    }

	    /**
	     * ContainerName - like a directory, holds blobs
	     */
	    @com.google.gson.annotations.SerializedName("containerName")
	    private String mContainerName;

	    /**
	     * Returns the item ContainerName
	     */
	    public String getContainerName() {
	        return mContainerName;
	    }

	    /**
	     * Sets the item ContainerName
	     *
	     * @param ContainerName
	     *            Uri to set
	     */
	    public final void setContainerName(String ContainerName) {
	        mContainerName = ContainerName;
	    }

	    /**
	     *  ResourceName
	     */
	    @com.google.gson.annotations.SerializedName("resourceName")
	    private String mResourceName;

	    /**
	     * Returns the item ResourceName
	     */
	    public String getResourceName() {
	        return mResourceName;
	    }

	    /**
	     * Sets the item ResourceName
	     *
	     * @param ResourceName
	     *            Uri to set
	     */
	    public final void setResourceName(String ResourceName) {
	        mResourceName = ResourceName;
	    }

	    /**
	     *  SasQueryString - permission to write to storage
	     */
	    @com.google.gson.annotations.SerializedName("sasQueryString")
	    private String mSasQueryString;

	    /**
	     * Returns the item SasQueryString
	     */
	    public String getSasQueryString() {
	        return mSasQueryString;
	    }

	    /**
	     * Sets the item SasQueryString
	     *
	     * @param SasQueryString
	     *            Uri to set
	     */
	    public final void setSasQueryString(String SasQueryString) {
	        mSasQueryString = SasQueryString;
	    }

2. Replace the 0-parameter constructor with this code:

	    /**
	     * ToDoItem constructor
	     */
	    public ToDoItem() {
	        mContainerName = "";
	        mResourceName = "";
	        mImageUri = "";
	        mSasQueryString = "";
	    }

3. Replace the multi-parameter constructor with this code:

	    /**
	     * Initializes a new ToDoItem
	     *
	     * @param text
	     *            The item text
	     * @param id
	     *            The item id
	     */
	    public ToDoItem(String text,
	                    String id,
	                    String containerName,
	                    String resourceName,
	                    String imageUri,
	                    String sasQueryString) {
	        this.setText(text);
	        this.setId(id);
	        this.setContainerName(containerName);
	        this.setResourceName(resourceName);
	        this.setImageUri(imageUri);
	        this.setSasQueryString(sasQueryString);
	    }


4. In the **ToDoActivity.java** file, replace the **addItem** method in **ToDoActivity.java**  with the following code that uploads the image.

	    /**
	     * Add a new item
	     *
	     * @param view
	     *            The view that originated the call
	     */
	    public void uploadPhoto(View view) {
	        if (mClient == null) {
	            return;
	        }

	        // Create a new item
	        final ToDoItem item = new ToDoItem();

	        item.setText(mTextNewToDo.getText().toString());
	        item.setComplete(false);
	        item.setContainerName("todoitemimages");

	        // Use a unigue GUID to avoid collisions.
	        UUID uuid = UUID.randomUUID();
	        String uuidInString = uuid.toString();
	        item.setResourceName(uuidInString);

	        // Send the item to be inserted. When blob properties are set this
	        // generates an SAS in the response.
	        AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>(){
	            @Override
	            protected Void doInBackground(Void... params) {
	                try {
		                    final ToDoItem entity = addItemInTable(item);

		                    // If we have a returned SAS, then upload the blob.
		                    if (entity.getSasQueryString() != null) {

	                       // Get the URI generated that contains the SAS
	                        // and extract the storage credentials.
	                        StorageCredentials cred =
								new StorageCredentialsSharedAccessSignature(entity.getSasQueryString());
	                        URI imageUri = new URI(entity.getImageUri());

	                        // Upload the new image as a BLOB from a stream.
	                        CloudBlockBlob blobFromSASCredential =
	                                new CloudBlockBlob(imageUri, cred);

	                        blobFromSASCredential.uploadFromFile(mPhotoFileUri.getPath());
  	                    }

	                    runOnUiThread(new Runnable() {
	                        @Override
	                        public void run() {
	                            if(!entity.isComplete()){
	                                mAdapter.add(entity);
	                            }
	                        }
	                    });
	                } catch (final Exception e) {
	                    createAndShowDialogFromTask(e, "Error");
	                }
	                return null;
	            }
	        };

	        runAsyncTask(task);

	        mTextNewToDo.setText("");
	    }


This code sends a request to the mobile service to insert a new TodoItem. The response contains the SAS, which is then used to upload the image from local storage to a blob in Azure storage.


## Test uploading the images

1. In Android Studio press **Run**. In the dialogue, choose the device to use.

2. When the app UI appears, enter text in the textbox labeled **Add a ToDo item**.

3. Press **Take Photo**. When the camera app starts, take a photo. Press the check mark to accept the photo.

4. Press **Upload**. Note how the ToDoItem has been added to the list, as usual.

5. In the Azure classic portal, go to your storage account and press the **Containers** tab, and press the name of your container in the list.

6. A list of your uploaded blob files will appear. Select one and press **Download**.

7. The image that you uploaded now appears in a browser window.


## <a name="next-steps"> </a>Next steps

Now that you have been able to securely upload images by integrating your mobile service with the Blob service, check out some of the other backend service and integration topics:

+ [Send email from Mobile Services with SendGrid]

  Learn how to add email functionality to your Mobile Service using the SendGrid email service. This topic demonstrates how to add server side scripts to send email using SendGrid.

+ [Schedule backend jobs in Mobile Services]

  Learn how to use the Mobile Services job scheduler functionality to define server script code that is executed on a schedule that you define.

+ [Mobile Services server script reference]

  Reference topics for using server scripts to perform server-side tasks and integration with other Azure components and external resources.

+ [Mobile Services .NET How-to Conceptual Reference]

  Learn more about how to use Mobile Services with .NET


<!-- Anchors. -->
[Install the Storage Client library]: #install-storage-client
[Update the client app to capture images]: #add-select-images
[Update the insert script to generate an SAS]: #update-scripts
[Upload images to test the app]: #test
[Next Steps]:#next-steps

<!-- Images. -->

[2]: ./media/mobile-services-windows-store-dotnet-upload-data-blob-storage/mobile-add-storage-nuget-package-dotnet.png


<!-- URLs. -->
[Send email from Mobile Services with SendGrid]: store-sendgrid-mobile-services-send-email-scripts.md
[Schedule backend jobs in Mobile Services]: mobile-services-schedule-recurring-tasks.md
[Send push notifications to Windows Store apps using Service Bus from a .NET back-end]: http://go.microsoft.com/fwlink/?LinkId=277073&clcid=0x409
[Mobile Services server script reference]: mobile-services-how-to-use-server-scripts.md
[Get started with Mobile Services]: mobile-services-javascript-backend-windows-store-dotnet-get-started.md

[Azure classic portal]: https://manage.windowsazure.com/
[How To Create a Storage Account]: ../storage-create-storage-account.md
[Azure Storage Client library for Store apps]: http://go.microsoft.com/fwlink/p/?LinkId=276866
[Mobile Services .NET How-to Conceptual Reference]: mobile-services-windows-dotnet-how-to-use-client-library.md
[App settings]: http://msdn.microsoft.com/library/windowsazure/b6bb7d2d-35ae-47eb-a03f-6ee393e170f7
