The following code shows how to create an asset, upload a media file to the asset, run a job with a task to transform the asset, and retrieve the URI of the transformed asset file .

You'll need to set up a media services account before using this code. For information about setting up an account, see [How to Create a Media Services Account](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-create-a-media-services-account/).

Substitute your values for the `clientId` and `clientSecret` variables. The code also relies on a locally stored file, `c:/media/MPEG4-H264.mp4`. You'll need to provide your own file to use.

	import java.io.*;
	import java.security.NoSuchAlgorithmException;
	import java.util.EnumSet;
	import java.util.List;
	
	import com.microsoft.windowsazure.services.core.Configuration;
	import com.microsoft.windowsazure.services.core.ServiceException;
	import com.microsoft.windowsazure.services.media.*;
	import com.microsoft.windowsazure.services.media.models.*;
	
	public class HelloMediaServices 
	{
	
		private static MediaContract mediaService;
		private static AssetInfo asset;
		private static AccessPolicyInfo accessPolicy;
		private static LocatorInfo locator;
		private static WritableBlobContainerContract uploader;
	
		public static void main(String[] args) 
		{
			try 
			{
	
				// Set up the MediaContract object to call into the media services.
				Init();
	
				// Upload a local file to a media asset.
				Upload();
	
				// Transform the asset.
				Transform();
	
				// Retrieve the URL of the asset's transformed output.
				Download();
	
				// Delete all assets. 
				// When you want to delete the assets that have been uploaded, 
				// comment out the calls to Upload(), Transfer(), and Download(), 
				// and uncomment the following call to Cleanup().
				//Cleanup();
				
				System.out.println("Application completed.");
			}
			catch (ServiceException se) 
			{
				System.out.println("ServiceException encountered.");
				System.out.println(se.getMessage());
			}
			catch (Exception e) 
			{
				System.out.println("Exception encountered.");
				System.out.println(e.getMessage());
			}
		}
	
		// Initialize the server context to get programmatic access to the Media Services programming objects.
		// The media services URI, OAuth URI and scope can be used exactly as shown.
		// Substitute your media service account name and access key for the clientId and clientSecret variables.
		// You can obtain your media service account name and access key from the Media Services section
		// of the Windows Azure Management portal, https://manage.windowsazure.com.
		private static void Init() 
		{
			String mediaServiceUri = "https://media.windows.net/API/";
			String oAuthUri = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13";
			String clientId = "your_client_id";  // Use your media service account name.
			String clientSecret = "your_client_seecret"; // Use your media service access key. 
			String scope = "urn:WindowsAzureMediaServices";
	
			// Specify the configuration values to use with the MediaContract object.
			Configuration configuration = MediaConfiguration
					.configureWithOAuthAuthentication(mediaServiceUri, oAuthUri, clientId, clientSecret, scope);
	
			// Create the MediaContract object using the specified configuration.
			mediaService = MediaService.create(configuration);
		}
	
		// Upload a media file to your Media Services account.
		// This code creates an asset, an access policy (using Write access) and a locator, 
		// and uses those objects to upload a local file to the asset.
		private static void Upload() throws ServiceException, FileNotFoundException, NoSuchAlgorithmException 
		{
			// Create an asset.
			asset = mediaService.create(Asset.create().setAlternateId("altId"));
			System.out.println("Created asset with id: " + asset.getId());
	
			// Create an access policy that provides Write access for 15 minutes.
			accessPolicy = mediaService.create(AccessPolicy.create("uploadAccessPolicy", 15.0, EnumSet.of(AccessPolicyPermission.WRITE)));
			System.out.println("Created access policy with id: "
					+ accessPolicy.getId());
	
			// Create a locator using the access policy and asset.
			// This will provide the location information needed to add files to the asset.
			locator = mediaService.create(Locator.create(accessPolicy.getId(),
					asset.getId(), LocatorType.SAS));
			System.out.println("Created locator with id: " + locator.getId());
			
			// Create the blob writer using the locator.
			uploader = mediaService.createBlobWriter(locator);
			
			// The name of the file as it will exist in your Media Services account.
			String fileName = "MPEG4-H264.mp4";  
			
			// The local file that will be uploaded to your Media Services account.
			InputStream input = new FileInputStream(new File("c:/media/MPEG4-H264.mp4"));
		
			// Upload the local file to the asset.
			uploader.createBlockBlob(fileName, input);
	
			// Inform Media Services about the uploaded files.
			mediaService.action(AssetFile.createFileInfos(asset.getId()));
		}
	
		// Create a job that contains a task to transform the asset.
		// In this example, the asset will be transformed using the Windows Azure Media Encoder.
		private static void Transform() throws ServiceException, InterruptedException 
		{
			// Use the Windows Azure Media Encoder, by specifying it by name.
			MediaProcessorInfo mediaProcessor = mediaService.list(MediaProcessor.list().set("$filter", "Name eq 'Windows Azure Media Encoder'")).get(0);
			
			// Create a task with the specified media processor, in this case to transform the original asset to the H.264 HD 720p VBR preset.
			// Information on the various configurations can be found at
			// http://msdn.microsoft.com/en-us/library/microsoft.expression.encoder.presets_members%28v=Expression.30%29.aspx.
			// This example uses only one task, but others could be added.
			Task.CreateBatchOperation task = Task.create(
					mediaProcessor.getId(),
					"<taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>")
					.setConfiguration("H.264 HD 720p VBR").setName("MyTask");
					
			// Create a job creator that specifies the asset, priority and task for the job. 
			Job.Creator jobCreator = Job.create()
			    .setName("myJob")
			    .addInputMediaAsset(asset.getId())
			    .setPriority(2)
			    .addTaskCreator(task);
	
			// Create the job within your Media Services account.
			// Creating the job automatically schedules and runs it.
			JobInfo jobInfo = mediaService.create(jobCreator);
			String jobId = jobInfo.getId();
			System.out.println("Created job with id: " + jobId);
			// Check to see if the job has completed.
			CheckJobStatus(jobId);
			
		}
	
		// Download the URL of the transformed asset.
		// This code an access policy (with Read access) and a locator,
		// and uses those objects to retrieve the path.
		// You can use the path to access the asset.
		private static void Download() throws ServiceException 
		{
			// Create an access policy that provides Read access for 15 minutes.
			AccessPolicyInfo downloadAccessPolicy = mediaService.create(AccessPolicy.create("Download", 15.0, EnumSet.of(AccessPolicyPermission.READ)));
			
			// Create a locator using the access policy and asset.
			// This will provide the location information needed to access the asset.
			LocatorInfo downloadlocator = mediaService.create(Locator.create(downloadAccessPolicy.getId(), asset.getId(), LocatorType.SAS));
	
			// Iterate through the files associated with the asset.
			for(AssetFileInfo assetFile: mediaService.list(AssetFile.list(asset.getAssetFilesLink())))
			{
				String file = assetFile.getName();
				String locatorPath = downloadlocator.getPath();
				int startOfSas = locatorPath.indexOf("?");
				String blobPath = locatorPath + file;
				if (startOfSas >= 0) 
				{
					blobPath = locatorPath.substring(0, startOfSas) + "/" + file + locatorPath.substring(startOfSas);
				}
				System.out.println("Path to asset file: " + blobPath);
			}
		}
	
		// Remove all assets from your Media Services account.
		// You could instead remove assets by name or ID, etc., but for 
		// simplicity this example removes all of them.
		private static void Cleanup() throws ServiceException 
		{
			// Retrieve a list of all assets.
			List<AssetInfo> assets = mediaService.list(Asset.list());
			
			// Iterate through the list, deleting each asset.
			for (AssetInfo asset: assets)
			{
				mediaService.delete(Asset.delete(asset.getId()));
			}
		}

		// Helper function to check to on the status of the job.
		private static void CheckJobStatus(String jobId) throws InterruptedException, ServiceException
		{
	        int maxRetries = 12; // Number of times to retry. Small jobs often take 2 minutes.
	        JobState jobState = null;
	        while (maxRetries > 0) 
	        {
	        	Thread.sleep(10000);  // Sleep for 10 seconds, or use another interval.
	            // Determine the job state.
	        	jobState = mediaService.get(Job.get(jobId)).getState();
	            System.out.println("Job state is " + jobState);
	            
	            if (jobState == JobState.Finished || jobState == JobState.Canceled || jobState == JobState.Error) 
	            {
	                // The job is done.
	                break;
	            }
	            // The job is not done. Sleep and loop if max retries 
	            // has not been reached.
	            maxRetries--;
	        }
		}
	
	}


The assets that you create are stored in Windows Azure storage. However, use only the Windows Azure media services APIs (not Windows Azure storage APIs) to add, update, or delete assets.

The code above used a media processor by accessing it via a specific media processor name. To determine which media processors are available, you could use the following code.

   	for (MediaProcessorInfo mediaProcessor:  mediaService.list(MediaProcessor.list()))
	{
		System.out.print(mediaProcessor.getName() + ", ");
		System.out.print(mediaProcessor.getId() + ", ");  
		System.out.print(mediaProcessor.getVendor() + ", ");  
		System.out.println(mediaProcessor.getVersion());  
	}

Alternatively, the following code shows how to retrieve the ID of a media processor by name.

	 String mediaProcessorName = "MP4 to Smooth Streams Task"; 
	 EntityListOperation<MediaProcessorInfo> operation;
     MediaProcessorInfo processor;

	 operation = MediaProcessor.list();
	 operation.getQueryParameters().putSingle("$filter", "Name eq '" + mediaProcessorName + "'");
	 processor = mediaService.list(operation).get(0); 
	 System.out.println("Processor named " + mediaProcessorName + 
			            " has ID of " + processor.getId());

Should you need to cancel a job that hasn't finished processing, the following code shows how to cancel a job by job ID.

    mediaService.action(Job.cancel("nb:jid:UUID:e62aa3f3-8996-604d-b97d-350cb1956e82"));




