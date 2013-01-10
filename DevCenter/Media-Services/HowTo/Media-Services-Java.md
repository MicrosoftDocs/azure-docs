The following code shows how to create an asset, upload a media file to the asset, and run a job with a task to transform the asset. 

You'll need to set up a media services account before using this code. For information about setting up an account, see [How to Create a Media Services Account](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-create-a-media-services-account/).

Substitute your values for the `clientId` and `clientSecret` variables. The code also relies on a locally stored file, `c:/media/MPEG4-H264.mp4`. You'll need to provide your own file to use.

	import java.io.FileInputStream;
	import java.io.IOException;
	import java.io.InputStream;
	import java.security.DigestInputStream;
	import java.security.MessageDigest;
	import java.util.ArrayList;
	import java.util.EnumSet;
	import java.util.Hashtable;
	import java.util.List;
	import com.microsoft.windowsazure.services.core.Configuration;
	import com.microsoft.windowsazure.services.core.ServiceException;
	import com.microsoft.windowsazure.services.media.*;
	import com.microsoft.windowsazure.services.media.implementation.content.AssetFileType;
	import com.microsoft.windowsazure.services.media.models.*;
	import com.microsoft.windowsazure.services.media.models.Job.Creator;
	import com.microsoft.windowsazure.services.core.storage.utils.Base64;
	
	public class MyAzureMediaServicesApp 
	{
	       // From http://msdn.microsoft.com/en-us/library/windowsazure/hh973635.aspx  
	       private final static String configMp4ToSmoothStreams = "<taskDefinition xmlns='http://schemas.microsoft.com/iis/media/v4/TM/TaskDefinition#'>" 
	               + "  <name>MP4 to Smooth Streams</name>"            
	               + "  <id>5e1e1a1c-bba6-11df-8991-0019d1916af0</id>"            
	               + "  <description xml:lang='en'>Converts MP4 files encoded with H.264 (AVC) video and AAC-LC audio codecs to Smooth Streams.</description>" 
	               + "  <inputFolder />"            
	               + "  <properties namespace='http://schemas.microsoft.com/iis/media/V4/TM/MP4ToSmooth#' prefix='mp4'>"            
	               + "    <property name='keepSourceNames' required='false' value='true' helpText='This property tells the MP4 to Smooth task to keep the original file name rather than add the bitrate bitrate information.' />"            
	               + "  </properties>"            
	               + "  <taskCode>"            
	               + "    <type>Microsoft.Web.Media.TransformManager.MP4toSmooth.MP4toSmooth_Task, Microsoft.Web.Media.TransformManager.MP4toSmooth, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35</type>"            
	               + "  </taskCode>" + "</taskDefinition>";
	      
	       public static void main(String[] args) 
	       {
	              try
	              {
	                     String mediaServiceBaseUri = "wamsbluclus001rest-hs.cloudapp.net"; 
	                     String oAuthUri = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13";
	                     String clientId = "your_client_id"; 
	                     String clientSecret = "your_client_secret";
	                     String scope = "urn:WindowsAzureMediaServices";
	
	                     Configuration configuration = MediaConfiguration.configureWithOAuthAuthentication(mediaServiceBaseUri, oAuthUri, clientId, clientSecret, scope);
	
	                     MediaContract mediaService = null;
	                     
	                     mediaService = MediaService.create(configuration);
	       
	                     if (null != mediaService)
	                     {
	                           // Create the asset.
	                           AssetInfo asset;
	                           asset = mediaService.create(Asset.create().setAlternateId("altId"));
	                           String assetId = asset.getId();
	                           System.out.println("Created asset with id: " + assetId);
	
	                           AccessPolicyInfo accessPolicy;
	                           accessPolicy = mediaService.create(AccessPolicy.create("myAccessPolicy", 10 /* minutes */, EnumSet.of(AccessPolicyPermission.WRITE)));
	                           System.out.println("Created access policy with id: " + accessPolicy.getId());
	                           
	                           LocatorInfo locator;
	                           locator = mediaService.create(Locator.create(accessPolicy.getId(), assetId, LocatorType.SAS));
	                           System.out.println("Created locator with id: " + locator.getId());
	                           
	                           WritableBlobContainerContract uploader;
	                           
	                           uploader = mediaService.createBlobWriter(locator);
	                           
	                           Hashtable<String, InputStream> inputFiles = new Hashtable<String, InputStream>();
	
	                           // Add an input file. A file from the local file system is used.
	                           inputFiles.put("MPEG4-H264.mp4", new FileInputStream("c:/media/MPEG4-H264.mp4"));
	                           
	                           Hashtable<String, AssetFileInfo> infoToUpload;
	                           infoToUpload = new Hashtable<String, AssetFileInfo>();
	                           boolean isFirst = true;
	                           for (String fileName : inputFiles.keySet())
	                           {
	                               MessageDigest digest;
	                               digest = MessageDigest.getInstance("MD5");
	                               InputStream inputStream = inputFiles.get(fileName);
	                               InputStream digestStream = new DigestInputStream(inputStream, digest);
	                               CountingStream countingStream = new CountingStream(digestStream);
	                               uploader.createBlockBlob(fileName,  countingStream);
	                               inputStream.close();
	                               
	                               byte[] md5hash = digest.digest();
	                               String md5 = Base64.encode(md5hash);
	                               
	                               System.out.println("md5: " + md5);
	                               
	                               AssetFileInfo fi;
	                               
	                               fi = new AssetFileInfo(null, new AssetFileType()
	                            		   .setContentChecksum(md5).setContentFileSize(new Long(countingStream.getCount()))
	                            		   .setIsPrimary(isFirst).setName(fileName).setParentAssetId(asset.getAlternateId()));
	                               infoToUpload.put(fileName, fi);
	                               isFirst = false;
	                           }
	                           
	                           mediaService.action(AssetFile.createFileInfos(assetId));
	                           
	                           List<Task.CreateBatchOperation> listTasks;
	                           listTasks = new ArrayList<Task.CreateBatchOperation>();
	                           
	                           Task.CreateBatchOperation task;
	                           String taskBody;
	                           taskBody = getTaskBody(0, 0);
	                           // MP4 to Smooth Streams Task Microsoft 1.5.3
	                           task = Task.create("nb:mpid:UUID:5f56e107-3cba-4010-88f4-f26199e15cd8", taskBody)
	                                     .setName("MP4 to SS").setConfiguration(configMp4ToSmoothStreams);  
	                           
	                           listTasks.add(task);
	                           
	                           Creator jobCreator;
	                           
	                           jobCreator = Job.create().setName("MyJob6").addInputMediaAsset(assetId).setPriority(2);
	                           
	                           jobCreator.addTaskCreator(task);
	                           System.out.println("Calling the jobCreator");
	                           JobInfo jobInfo;
	                           jobInfo = mediaService.create(jobCreator);
	                           String jobId = jobInfo.getId();
	                           System.out.println("Created job with id: " + jobId);
	                     }
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
	       
	       private static class CountingStream extends InputStream 
	       {        
	          private final InputStream wrappedStream;        
	           private int count;        
	           public CountingStream(InputStream wrapped) 
	           {            
	                 wrappedStream = wrapped;            
	                 count = 0;        
	           }
	           @Override public int read() throws IOException 
	           {
	                 count++;            
	                 return wrappedStream.read();        
	           }        
	           public int getCount() 
	           {            
	                 return count;        
	           } 
	        }
	       
	       private static String getTaskBody(int inputAssetId, int outputAssetId) 
	       {   
	          return "<taskBody><inputAsset>JobInputAsset(" + inputAssetId + ")</inputAsset>" 
	                  + "<outputAsset>JobOutputAsset(" + outputAssetId + ")</outputAsset></taskBody>";
	       }
	}

The code above used a media processor by accessing it via a specific media processor ID. To determine which media processors are available, you can use the following code.

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

The following code shows how to check the status of a job. This example assumes the `jobId` variable was previously assigned (for example, when a job was created, as shown in the first sample in this topic).

    // Check the status of the job.
    int maxRetries = 10; // Number of times to retry.
    JobState jobState = null;
    while (maxRetries > 0)
    {
        jobState = mediaService.get(Job.get(jobId)).getState();
        System.out.println("Job state is " + jobState);
        if (JobState.Finished == jobState ||
            JobState.Canceled == jobState ||
            JobState.Error == jobState)
	    {
            // The job is done.
            break;
        }
        // The job is not done. Sleep and loop if max retries not reached.
        maxRetries--;
        Thread.sleep(1000);
    }

You can also check the status of the job, and determine the job ID, within the media services section of the Windows Azure Management Portal.

Should you need to cancel a job that hasn't finished processing, the following code shows how to cancel a job by job ID.

    mediaService.action(Job.cancel("nb:jid:UUID:e62aa3f3-8996-604d-b97d-350cb1956e82"));

The following code shows how to download files for a transformed asset.

    List<AssetInfo> outputAssets;
    
    JobInfo jobInfo;
   
    jobInfo = mediaService.get(jobId));
	   
	outputAssets = mediaService.list(Asset.list(jobInfo.getOutputAssetsLink()));
	   
	for (AssetInfo ai: outputAssets)
	{
	   System.out.println(ai.getName());
	   System.out.println(ai.getId());
	   System.out.println(ai.getState());
    
	List<URL> urls;
	urls = new ArrayList<URL>();
	AccessPolicyInfo readAP = mediaService.create(AccessPolicy.create("tempAccessPolicy",
	              10, EnumSet.of(AccessPolicyPermission.READ)));
	       
	LocatorInfo readLocator = mediaService.create(Locator.create(readAP.getId(), ai.getId(), LocatorType.SAS));
	
	List<AssetFileInfo> publishedFiles = mediaService.list(AssetFile.list(ai.getAssetFilesLink()));

    for (AssetFileInfo fi: publishedFiles)
	{
	    URL file = null;
	    file = constructUrlFromLocatorAndFileName(readLocator, fi.getName());
	    urls.add(file);
	    // Download the file locally.
	    System.out.println("Downloading the file now " + fi.getName());
	    System.out.println(file.toExternalForm());
	    InputStream reader = null;        
	    for (int counter = 0; true; counter++) 
	    {            
		   try 
		   {
			   reader = file.openConnection().getInputStream();
		 
			   byte[] buffer1 = new byte[1024];
			 
			   FileOutputStream output;
			   output = new FileOutputStream("c:/media/" + fi.getName());
			 
			   int numRead;
			   numRead = reader.read(buffer1);
			   while (-1 != numRead)
			   {
				  output.write(buffer1,  0, numRead);
				  numRead = reader.read(buffer1);
			   }
			   reader.close();
			   output.close();
			   break;            
	       }            
		   catch (IOException e) 
		   {
			  System.out.println("Received an error, sleep and try again.");
			  if (counter < 6) 
			  {
				 Thread.sleep(10000);
			  }
			  else 
			  {
				 // No more retries.
	        	 throw e;
	          }         
	       }
        }
    }

The assets that you create are stored in Windows Azure storage. However, use only the Windows Azure media services APIs (not Windows Azure storage APIs) to add, update, or delete assets.

The following code shows how to list all assets and display their name, ID, and state.

	 List<AssetInfo> myList = mediaService.list(Asset.list());
	 for (AssetInfo asset: myList)
	 {
		 System.out.print(asset.getName() + ", ");
		 System.out.print(asset.getId() + ", ");
		 System.out.println(asset.getState());
	 }

The following code shows how to delete an asset by ID.

    mediaService.delete(Asset.delete("nb:cid:UUID:79ff877a-48d1-4b2b-a004-31a8f91e2555"));

The following code shows how to list all access policies and display their name and ID.

	 List<AccessPolicyInfo> myList = mediaService.list(AccessPolicy.list());
	 
	 for (AccessPolicyInfo policy: myList)
	 {
		 System.out.print(policy.getName() + " ");
		 System.out.println(policy.getId());
	 }

The following code shows how to delete an access policy by access policy ID. It is important to delete unneeded access policies, as there is a limit for how many can be applied.

    mediaService.delete(AccessPolicy.delete("nb:pid:UUID:ce99644d-4227-4e2b-8fac-af50dbb1c4ff"));

The following code shows how to delete a job by job ID.

    mediaService.delete(Job.delete("nb:jid:UUID:e62aa3f3-8996-604d-b97d-350cb1956e82"));
