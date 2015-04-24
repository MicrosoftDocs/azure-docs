<properties 
	pageTitle="Using import/export to transfer data to Blob Storage | Microsoft Azure" 
	description="Learn how to create import and export jobs in the Azure Management Portal to transfer data to blob storage." 
	authors="tamram" 
	manager="adinah" 
	editor="" 
	services="storage" 
	documentationCenter=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/05/2015" 
	ms.author="tamram"/>


# Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage

## Overview

You can use the Microsoft Azure Import/Export service to transfer large amounts of file data to Azure Blob storage in situations where uploading over the network is prohibitively expensive or not feasible. You can also use the Import/Export service to transfer large quantities of data resident in Blob storage to your on-premises installations in a timely and cost-effective manner.

To transfer a large set of file data into Blob storage, you can send one or more hard drives containing that data to an Azure data center, where your data will be uploaded to your storage account. Similarly, to export data from Blob storage, you can send empty hard drives to an Azure data center, where the Blob data from your storage account will be copied to your hard drives and then returned to you. Before you send in a drive that contains data, you'll encrypt the data on the drive; when the Import/Export service exports your data to send to you, the data will also be encrypted before shipping.

You can create and manage import and export jobs in one of two ways:

- By using the Azure Management Portal.
- By using a REST interface to the service.

This article provides an overview of the Import/Export service and describes how to use the Management Portal to work with the Import/Export service. For information on the REST API, see the [Azure Import/Export Service REST API Reference](http://go.microsoft.com/fwlink/?LinkID=329099).

## Introduction to the Import/Export Service ##

To begin the process of importing to or exporting from Blob storage, you first create a *job*. A job can be an *import job* or an *export job*:

- Create an import job when you want to transfer data you have on-premise to blobs in your Azure storage account.
- Create an export job when you want to transfer data currently stored as blobs in your storage account to hard drives that are shipped to you.

When you create a job, you notify the Import/Export service that you will be shipping one or more hard drives to an Azure data center. For an import job, you'll be shipping hard drives containing file data. For an export job, you'll be shipping empty hard drives.

To prepare your drive to ship for an import job, you'll run the **Microsoft Azure Import/Export Tool** tool, which facilitates copying your data to the drive, encrypting the data on the drive with BitLocker, and generating the drive journal files, which are discussed below.

> [AZURE.NOTE] The data on the drive must be encrypted using BitLocker Drive Encryption. This protects your data while it is in transit. For an export job, the Import/Export service will encrypt your data before shipping the drive back to you.

When you create an import job or an export job, you'll also need the *drive ID*, which is the serial number assigned by the drive manufacturer to a specific hard disk. The drive ID is displayed on the exterior of the drive. 

### Requirements and Scope

1.	**Subscription and storage accounts:** You must have an existing Azure subscription and one or more storage accounts to use the Import/Export service. Each job may be used to transfer data to or from only one storage account. In other words, a job cannot span across multiple storage accounts. For information on creating a new storage account, see [How to Create a Storage Account](storage-create-storage-account.md).
2.	**Hard drives:** Only 3.5 inch SATA II/III hard drives are supported for use with the Import/Export service. Hard drives up to 6TB are supported. For import jobs, only the first data volume on the drive will be processed. The data volume must be formatted with NTFS. You can attach a SATA II/III disk externally to most computers using a SATA II/III USB Adapter.
3.	**BitLocker encryption:** All data stored on hard drives must be encrypted using BitLocker with encryption keys protected with numerical passwords.
4.	**Blob storage targets:** Data may be uploaded to or downloaded from block blobs and page blobs. 
5.	**Number of jobs:** A customer may have up to 20 jobs active per storage account.
6.	**Maximum size of a job:** The size of a job is determined by the capacity of the hard drives used and the maximum amount of data that can be stored in a storage account. Each job may contain no more than 10 hard drives.

## Create an Import Job in the Management Portal##

Create an import job to notify the Import/Export service that you'll be shipping one or more drives containing data to the data center to be imported into your storage account.

### Prepare Your Drives

Before you create an import job, prepare your drives with the Microsoft Azure Import/Export Tool. For more details about using the Microsoft Azure Import/Export Tool, see the [Microsoft Azure Import/Export Tool Reference](http://go.microsoft.com/fwlink/?LinkId=329032). You can download the [Microsoft Azure Import/Export Tool](http://go.microsoft.com/fwlink/?LinkID=301900&clcid=0x409) as a standalone package.
  
To prepare your drives, follow these three steps: 

1.	Determine the data to be imported, and the number of drives you'll need.
2.	Identify the destination blobs for your data in the Azure Blob service.
3.	Use the Microsoft Azure Import/Export Tool to copy your data to one or more hard drives.

The Microsoft Azure Import/Export Tool generates a *drive journal* file for each drive as it is prepared. The drive journal file is stored on your local computer, not on the drive itself. You'll upload the journal file when you create the import job. A drive journal file includes the drive ID and the BitLocker key, as well as other information about the drive.  

### Create the Import Job

1.	Once you have prepared your drive, navigate to your storage account in the Management Portal, and view the 	Dashboard. Under <strong>Quick Glance</strong>, click <strong>Create an Import Job</strong>. 
 
2.	In Step 1 of the wizard, indicate that you have prepared your drive and that you have the drive journal file 	available.
 
3.	In Step 2, provide contact information for the person responsible for this import job. If you wish to save 	verbose log data for the import job, check the option to <strong>Save the verbose log in my 'waimportexport' 	blob container</strong>.

4.	In Step 3, upload the drive journal files that you obtained during the drive preparation step. You'll need 	to upload one file for each drive that you have prepared.

	![Create import job - Step 3][import-job-03]

5.	In Step 4, enter a descriptive name for the import job. Note that the name you enter may contain only 	lowercase letters, numbers, hyphens, and underscores, must start with a letter, and may not contain spaces. 	You'll use the name you choose to track your jobs while they are in progress and once they are completed.

	Next, select your data center region from the list. The data center region will indicate the data center and address to which you must ship your package. See the FAQ below for more information.

6. 	In Step 5, select your return carrier from the list, and enter your carrier account number. Microsoft will use this account to ship your drives back to you once your import job is complete.

	If you have your tracking number, then select your delivery carrier from the list, and enter your tracking number. 

	If you do not have a tracking number yet, choose **I will provide my shipping information for this import job once I have shipped my package**, then complete the import process.

7. To enter your tracking number after you have shipped your package, return to the **Import/Export** page for your storage account in the Management Portal, select your job from the list, and choose **Shipping Info**. Navigate through the wizard and enter your tracking number in Step 2. 
	
	If the tracking number is not updated within 2 weeks of creating the job, the job will expire.

	If the job is in the Creating, Shipping or Transferring state, you can also update your carrier account number in Step 2 of the wizard. Once the job is in the Packaging state, you cannot update your carrier account number for that job. 

## Create an Export Job in the Management Portal##

Create an export job to notify the Import/Export service that you'll be shipping one or more empty drives to the data center, so that data can be exported from your storage account to the drives, and the drives then shipped to you.

1. 	To create an export job, navigate to your storage account in the Management Portal, and view the Dashboard. 	Under <strong>Quick Glance</strong>, click <strong>Create an Export Job</strong>, and proceed through the 	wizard.

2. 	In Step 2, provide contact information for the person responsible for this export job. If you wish to save 	verbose log data for the export job, check the option to <strong>Save the verbose log in my 'waimportexport' 	blob container</strong>.

3.	In Step 3, specify which blob data you wish to export from your storage account to your blank drive or 	drives. You can choose to export all blob data in the storage account, or you can specify which blobs 	or 	sets of blobs to export.

	![Create export job - Step 3][export-job-03]

	- To specify a blob to export, use the **Equal To** selector, and specify the relative path to the blob, beginning with the container name. Use *$root* to specify the root container.
	- To specify all blobs starting with a prefix, use the **Starts With** selector, and specify the prefix, beginning with a forward slash '/'. The prefix may be the prefix of the container name, the complete container name, or the complete container name followed by the prefix of the blob name.

	The table shows examples of valid blob paths:

	<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
		<tbody>
			<tr>
				<td><strong>Selector</strong></td>
				<td><strong>Blob Path</strong></td>
				<td><strong>Description</strong></td>
			</tr>
			<tr>
				<td>Starts With</td>
				<td>/</td>
				<td>Exports all blobs in the storage account</td>
			</tr>
			<tr>
				<td>Starts With</td>
				<td>/$root/</td>
				<td>Exports all blobs in the root container</td>
			</tr>
			<tr>
				<td>Starts With</td>
				<td>/book</td>
				<td>Exports all blobs in any container that begins with prefix <strong>book</strong></td>
			</tr>
			<tr>
				<td>Starts With</td>
				<td>/music/</td>
				<td>Exports all blobs in container <strong>music</strong></td>
			</tr>
			<tr>
				<td>Starts With</td>
				<td>/music/love</td>
				<td>Exports all blobs in container <strong>music</strong> that begin with prefix <strong>love</strong></td>
			</tr>
			<tr>
				<td>Equal To</td>
				<td>$root/logo.bmp</td>
				<td>Exports blob <strong>logo.bmp</strong> in the root container</td>
			</tr>
			<tr>
				<td>Equal To</td>
				<td>videos/story.mp4</td>
				<td>Exports blob <strong>story.mp4</strong> in container <strong>videos</strong></td>
			</tr>
		</tbody>
	</table>


4.	In Step 4, enter a descriptive name for the export job. The name you enter may contain only lowercase 	letters, numbers, hyphens, and underscores, must start with a letter, and may not contain spaces.

	The data center region will indicate the data center to which you must ship your package. See the FAQ below for more information.

5. 	In Step 5, select your return carrier from the list, and enter your carrier account number. Microsoft will use this account to ship your drives back to you once your export job is complete.

	If you have your tracking number, then select your delivery carrier from the list, and enter your tracking number. 

	If you do not have a tracking number yet, choose <strong>I will provide my shipping information for this export job once I have shipped my package</strong>, then complete the export process.

6. To enter your tracking number after you have shipped your package, return to the **Import/Export** page for your storage account in the Management Portal, select your job from the list, and choose **Shipping Info**. Navigate through the wizard and enter your tracking number in Step 2. 
	
	If the tracking number is not updated within 2 weeks of creating the job, the job will expire.

	If the job is in the Creating, Shipping or Transferring state, you can also update your carrier account number in Step 2 of the wizard. Once the job is in the Packaging state, you cannot update your carrier account number for that job. 

> [AZURE.NOTE] If the blob to be exported is in use at the time of copying to hard drive, Azure Import/Export service will take a snapshot of the blob and copy the snapshot.

## Track Job Status in the Management Portal##

You can track the status of your import or export jobs from the Management Portal. Navigate to your storage account in the Management Portal, and click the **Import/Export** tab. A list of your jobs will appear on the page. You can filter the list on job status, job name, job type, or tracking number.

The table describes what each job status designation means:

<table border="1" cellspacing="0" cellpadding="5" style="border: 1px solid #000000;">
	<tbody>
		<tr>
			<td><strong>Job Status</strong></td>
			<td><strong>Description</strong></td>
		</tr>
		<tr>
			<td>Creating</td>
			<td>Your job has been created, but you have not yet provided your shipping information.</td>
		</tr>
		<tr>
			<td>Shipping</td>
			<td>Your job has been created and you have provided your shipping information.</td>
		</tr>
		<tr>
			<td>Transferring</td>
			<td>Your data is being transferred from your hard drive (for an import job) or to your hard drive (for an export job).</td>
		</tr>
		<tr>
			<td>Packaging</td>
			<td>The transfer of your data is complete, and your hard drive is being prepared for shipping back to you.</td>
		</tr>
		<tr>
			<td>Complete</td>
			<td>Your hard drive has been shipped back to you.</td>
		</tr>
	</tbody>
</table>

## View BitLocker Keys for an Export Job ##

For export jobs, you can view and copy the BitLocker keys generated by the service for your drive, so that you can decrypt your exported data once you receive the drives from the Azure data center. Navigate to your storage account in the Management Portal, and click the **Import/Export** tab. Select your export job from the list, and click the **View Keys** button. The BitLocker keys appear as shown:

![View BitLocker keys for export job][export-job-bitlocker-keys]

## Frequently Asked Questions ##

### General

**What is the pricing for the Import/Export service?**

- See the [pricing page](http://go.microsoft.com/fwlink/?LinkId=329033) for pricing information.

**How long will it take to import or export my data?**

- It will take the time to ship the disks, plus several hours per TB of data to copy the data.
 
**What interface types are supported?**

- The Import/Export service supports 3.5-inch SATA II/III internal hard drive disks (HDDs). You can use the following converters to transfer data in the devices in USB to SATA prior to shipping:
	- Anker 68UPSATAA-02BU
	- Anker 68UPSHHDS-BU
	- Startech SATADOCK22UE 

> [AZURE.NOTE] If you have a converter which is not listed above, you can try running the Microsoft Azure Import/Export Tool using your converter to prepare the drive and see if it works before purchasing a supported converter.

**If I want to import or export more than 10 drives, what should I do?**

- One import or export job can reference only 10 drives in a single job for the Import/Export service. If you want to ship more than 10 drives, you can create multiple jobs.

**What happens if I accidentally send an HDD which does not conform to the supported requirements?**

- The Azure data center will return the drive that does not conform to the supported requirements to you. If only some of the drives in the package meet the support requirements, those drives will be processed, and the drives that do not meet the requirements will be returned to you.

### Import/Export Job Management

**What happens to my import and export jobs if I delete my Azure storage account?**

- When you delete your storage account, all Azure Import/Export jobs are deleted along with your account.  

**Can I cancel my job?**

- You can cancel a job when its status is Creating or Shipping.

**How long can I view the status of completed jobs in the Management Portal?**

- You can view status for completed jobs for up to 90 days. All completed jobs will be deleted after 90 days.

**Is Bitlocker encryption a mandatory requirement?**

- Yes. All drives must be encrypted with a BitLocker key.

**Do you format the drives before returning them?**

- No. All drives must be BitLocker-prepared.
 
**Do I need to perform any disk preparation when creating an export job?**
- No, but some pre-checks are recommended. Check the number of disks required using Azure Import/Export tool's [PreviewExport](https://msdn.microsoft.com/en-us/library/azure/dn722414.aspx) command. It helps you preview drive usage for the blobs you selected, based on the size of the drives you are going to use. Also check that you can read/write to the hard drive that will be shipped for the export job.

### Shipping

**What courier services are supported?**

- For regions in the US and Europe, only [Federal Express](http://www.fedex.com/us/oadr/) (FedEx) is supported. All packages will be returned via FedEx Ground or FedEx International Economy.

- For regions in Asia, only [DHL](http://www.dhl-welcome.com/Tutorial/) is supported. All packages will be returned via DHL Express Worldwide.

	> [AZURE.IMPORTANT] You must provide your tracking number to the Azure Import/Export service; otherwise your job cannot be processed.

**Is there any cost associated with return shipping?**

- Microsoft will use the carrier account number you provide at the time of job creation to ship drives to your return address from the data center. Please make sure to provide a carrier account number for the data center region’s supported carrier. You can create a [FedEx](http://www.fedex.com/us/oadr/) (for US and Europe) or [DHL](http://www.dhl-welcome.com/Tutorial/) (Asia) carrier account if you do not have one.

- The return shipping fee is charged to your carrier account, and depends on the carrier.

**Where can I ship my data from and to?**

- The Import/Export service supports importing data to and exporting data from storage accounts in the following regions:
	- East US 
	- West US 
	- North Central US 
	- South Central US 
	- North Europe
	- West Europe
	- East Asia
	- Southeast Asia

- You will be provided a shipping address in the region where your storage account resides. For example, if you live in the US, and your storage account is in the West Europe data center, you will be provided with a shipping address in Europe to send the drives.

	> [AZURE.IMPORTANT] Please note that the physical media that you are shipping may need to cross international borders. You are responsible for ensuring that your physical media and data are imported and/or exported in accordance with the applicable laws. Before shipping the physical media, check with your advisors to verify that your media and data can legally be shipped to the identified data center. This will help to ensure that it reaches Microsoft in a timely manner.

- In shipping your packages, you must follow the terms at [Microsoft Azure Service Terms](http://azure.microsoft.com/support/legal/services-terms/). 

**Can I purchase drives for import/export jobs from Microsoft?**

- 	No. You will need to ship your own drives for both import and export jobs.

**What should I include in my package?**

- Please ship only your hard drives. Do not include items like power supply cables or USB cables.



[import-job-03]: ./media/storage-import-export-service/import-job-03.png
[export-job-03]: ./media/storage-import-export-service/export-job-03.png
[export-job-bitlocker-keys]: ./media/storage-import-export-service/export-job-bitlocker-keys.png
