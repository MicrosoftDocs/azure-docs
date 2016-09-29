<properties
	pageTitle="How to use Blob Storage from Xamarin | Microsoft Azure"
	description="The Azure Storage Client Library for Xamarin enables developers to create iOS, Android, and Windows Store apps with their native user interfaces. This tutorial shows how to use Xamarin to create an application that uses Azure Blob storage."
	services="storage"
	documentationCenter="xamarin"
	authors="micurd"
	manager="jahogg"
	editor="tysonn"/>

<tags
	ms.service="storage"
	ms.workload="storage"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/31/2016"
	ms.author="micurd;tamram"/>

# How to use Blob Storage from Xamarin

[AZURE.INCLUDE [storage-selector-blob-include](../../includes/storage-selector-blob-include.md)]

## Overview

Xamarin enables developers to use a shared C# codebase to create iOS, Android, and Windows Store apps with their native user interfaces. This tutorial shows you how to use Azure Blob storage with a Xamarin application. If you'd like to learn more about Azure Storage, before diving into the code, see [Introduction to Microsoft Azure Storage](storage-introduction.md).

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

[AZURE.INCLUDE [storage-mobile-authentication-guidance](../../includes/storage-mobile-authentication-guidance.md)]

## Create a new Xamarin Application

For this getting started, we'll be creating an app that targets Android, iOS, and Windows. This app will simply create a container and upload a blob into this container. We'll be using Visual Studio on Windows for this getting started, but the same learnings can be applied when creating an app using Xamarin Studio on Mac OS.

Follow these steps to create your application:

1. If you haven't already, download and install [Xamarin for Visual Studio](https://www.xamarin.com/download).
2. Open Visual Studio, and create a Blank App (Native Shared): **File > New > Project > Cross-Platform > Blank App(Native Shared)**.
3. Right-click your solution in the Solution Explorer pane and select **Manage NuGet Packages for Solution**. Search for **WindowsAzure.Storage** and install the latest stable version to all projects in your solution.
4. Build and run your project.

You should now have an application that allows you to click a button which increments a counter.

> [AZURE.NOTE] The Azure Storage Client Library for Xamarin also works for Xamarin.Forms applications.

## Create container and upload blob

Next, you'll add some code to the shared class `MyClass.cs` that creates a container and uploads a blob into this container. `MyClass.cs` should look like the following:

	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Blob;
	using System.Threading.Tasks;

	namespace XamarinApp
	{
		public class MyClass
		{
			public MyClass ()
			{
			}

		    public static async Task createContainerAndUpload()
		    {
		        // Retrieve storage account from connection string.
		        CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=your_account_name_here;AccountKey=your_account_key_here");

		        // Create the blob client.
		        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

		        // Retrieve reference to a previously created container.
		        CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

				// Create the container if it doesn't already exist.
            	await container.CreateIfNotExistsAsync();

		        // Retrieve reference to a blob named "myblob".
		        CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

		        // Create the "myblob" blob with the text "Hello, world!"
		        await blockBlob.UploadTextAsync("Hello, world!");
		    }
		}
	}

Make sure to replace "your_account_name_here" and "your_account_key_here" with your actual account name and account key. You can then use this shared class in your iOS, Android, and Windows Phone application. You can simply add `MyClass.createContainerAndUpload()` to each project. For example:

### XamarinApp.Droid > MainActivity.cs

	using Android.App;
	using Android.Widget;
	using Android.OS;

	namespace XamarinApp.Droid
	{
		[Activity (Label = "XamarinApp.Droid", MainLauncher = true, Icon = "@drawable/icon")]
		public class MainActivity : Activity
		{
			int count = 1;

			protected override async void OnCreate (Bundle bundle)
			{
				base.OnCreate (bundle);

				// Set our view from the "main" layout resource
				SetContentView (Resource.Layout.Main);

				// Get our button from the layout resource,
				// and attach an event to it
				Button button = FindViewById<Button> (Resource.Id.myButton);

				button.Click += delegate {
					button.Text = string.Format ("{0} clicks!", count++);
				};

	      	  await MyClass.createContainerAndUpload();
			}
		}
	}

### XamarinApp.iOS > ViewController.cs

	using System;
	using UIKit;

	namespace XamarinApp.iOS
	{
		public partial class ViewController : UIViewController
		{
			int count = 1;

			public ViewController (IntPtr handle) : base (handle)
			{
			}

			public override async void ViewDidLoad ()
			{
				base.ViewDidLoad ();
				// Perform any additional setup after loading the view, typically from a nib.
				Button.AccessibilityIdentifier = "myButton";
				Button.TouchUpInside += delegate {
					var title = string.Format ("{0} clicks!", count++);
					Button.SetTitle (title, UIControlState.Normal);
				};

	            await MyClass.createContainerAndUpload();
	    	}

			public override void DidReceiveMemoryWarning ()
			{
				base.DidReceiveMemoryWarning ();
				// Release any cached data, images, etc that aren't in use.
			}
		}
	}

### XamarinApp.WinPhone > MainPage.xaml > MainPage.xaml.cs

	using Windows.UI.Xaml.Controls;
	using Windows.UI.Xaml.Navigation;

	// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=391641

	namespace XamarinApp.WinPhone
	{
	    /// <summary>
	    /// An empty page that can be used on its own or navigated to within a Frame.
	    /// </summary>
	    public sealed partial class MainPage : Page
	    {
	        int count = 1;

	        public MainPage()
	        {
	            this.InitializeComponent();

	            this.NavigationCacheMode = NavigationCacheMode.Required;
	        }

	        /// <summary>
	        /// Invoked when this page is about to be displayed in a Frame.
	        /// </summary>
	        /// <param name="e">Event data that describes how this page was reached.
	        /// This parameter is typically used to configure the page.</param>
	        protected override async void OnNavigatedTo(NavigationEventArgs e)
	        {
	            // TODO: Prepare page for display here.

	            // TODO: If your application contains multiple pages, ensure that you are
	            // handling the hardware Back button by registering for the
	            // Windows.Phone.UI.Input.HardwareButtons.BackPressed event.
	            // If you are using the NavigationHelper provided by some templates,
	            // this event is handled for you.
	            Button.Click += delegate {
	                var title = string.Format("{0} clicks!", count++);
	                Button.Content = title;
	            };

	            await MyClass.createContainerAndUpload();
	        }
	    }
	}


## Run the application

You can now run this application in an Android or Windows Phone emulator. You can also run this application in an iOS emulator, but this will require a Mac. For specific instructions on how to do this, please read the documentation for [connecting Visual Studio to a Mac](https://developer.xamarin.com/guides/ios/getting_started/installation/windows/connecting-to-mac/)

Once you run your app, it will create the container `mycontainer` in your Storage account. It should contain the blob, `myblob`, which has the text, `Hello, world!`. You can verify this by using the [Microsoft Azure Storage Explorer](http://storageexplorer.com/).

## Next steps

In this getting started, you learned how to create a cross-platform application in Xamarin that uses Azure Storage. This getting started specifically focused on one scenario in Blob Storage. However, you can do a lot more with, not only Blob Storage, but also with Table, File, and Queue Storage. Please check out the following articles to learn more:
- [Get started with Azure Blob Storage using .NET](storage-dotnet-how-to-use-blobs.md)
- [Get started with Azure Table Storage using .NET](storage-dotnet-how-to-use-tables.md)
- [Get started with Azure Queue Storage using .NET](storage-dotnet-how-to-use-queues.md)
- [Get started with Azure File Storage on Windows](storage-dotnet-how-to-use-files.md)

[AZURE.INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]
