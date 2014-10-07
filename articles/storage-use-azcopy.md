<properties linkid="storage-use-azcopy" urlDisplayName="AzCopy" pageTitle="How to use AzCopy with Microsoft Azure Storage" metaKeywords="Get started Azure AzCopy   Azure unstructured data   Azure unstructured storage   Azure blob   Azure blob storage   Azure file   Azure file storage   Azure file share   AzCopy" description="Learn how to use the AzCopy utility to upload, download, and copy blob and file content." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter="" title="How to use AzCopy with Microsoft Azure Storage" authors="tamram" manager="adinah" editor="cgronlun" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/06/2014" ms.author="tamram" />

# Getting Started with the AzCopy Command-Line Utility

AzCopy is a command-line utility designed for high-performance uploading, downloading, and copying data to and from Microsoft Azure Blob and File storage. This guide provides an overview for using AzCopy.

> [WACOM.NOTE] This guide assumes that you have installed AzCopy 2.5 or later. Note that AzCopy is in pre-release, so command-line options and their functions may change in future releases.

##Table of contents

- [Download and install AzCopy](#install)
- [Understand the AzCopy command-line syntax](#syntax)
- [Limit concurrent writes while copying data](#limit-writes)
- [Copy Azure blobs with AzCopy](#copy-blobs)
- [Copy files in an Azure file share with AzCopy](#copy-files)
- [AzCopy versions](#versions)
- [Next steps](#next-steps)

##<a id="install"></a> Download and install AzCopy

1. Download the [latest version of AzCopy](http://aka.ms/downloadazcopy).
2. Run the installation. By default, the AzCopy installation creates a folder named `AzCopy` under `%ProgramFiles(x86)%\Microsoft SDKs\Azure\` (on a machine running 64-bit Windows) or `%ProgramFiles%\Microsoft SDKs\Azure\` (on a machine running 32-bit Windows). However, you can change the installation path from the setup wizard.
3. If desired, you can add the AzCopy installation location to your system path.

##<a id="syntax"></a> Understand the AzCopy command-line syntax

Next, open a command window, and navigate to the AzCopy installation directory on your computer, where the `AzCopy.exe` executable is located. The basic syntax for AzCopy commands is:

	AzCopy <source> <destination> [filepattern] [options]

- The `<source>` parameter specifies the source data from which to copy. The source can be a file system directory, a blob container, a blob virtual directory, or a storage file share.

- The `<destination>` parameter specifies the destination to copy to. The destination can be a file system directory, a blob container, a blob virtual directory, or a storage file share.

- The behavior of the optional `filepattern` parameter is determined by the location of the source data, and the presence of the recursive mode option. Recursive mode is specified via option `/S`. 
	
	If the specified source is a directory in the file system, then standard wildcards are in effect, and the file pattern provided is matched against files within the directory. If option `/S` is specified, then AzCopy also matches the specified pattern against all files in any subfolders beneath the directory.
	
	If the specified source is a blob container or virtual directory, then wildcards are not applied. If option `/S` is specified, then AzCopy interprets the specified file pattern as a blob prefix. If option `/S` is not specified, then AzCopy matches the file pattern against exact blob names.
	
	If the specified source is an Azure file share, then you must either specify the exact file name, (*e.g.* `abc.txt`) to copy a single file, or specify option `/S` to copy all files in the share recursively. Attempting to specify both a file pattern and option `/S` together will result in an error.
	
	The default file pattern used when no file pattern is specified is `*.*` for a file system directory, or an empty prefix for an Azure Blob or File storage resource.

	> [WACOM.NOTE] Due to performance considerations, AzCopy version 2.5 no longer supports multiple file patterns in a single command. You must now issue multiple commands, each with a single file pattern, to address the scenario of multiple file patterns.

- The available options for the `options` parameter are described in the table below. You can also type `AzCopy /?` from the command line for help with options.

<table>
  <tr>
    <th>Option Name</th>
    <th>Description</th>
    <th>Applicable to Blob Storage (Y/N)</th>
    <th>Applicable to File Storage (Y/N)</th>
  </tr>
  <tr>
    <td><b>/DestKey:&lt;storage-key&gt;</b></td>
    <td>Specifies the storage account key for the destination resource.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/DestSAS:&lt;container-SAS&gt;</b></td>
    <td>Specifies a Shared Access Signature (SAS) for the destination container (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters.<br />
        If the destination resource is a blob, you can either specify this option followed by the SAS token, or you can specify the SAS as part of the destination blob's URI, without this option.<br />
        This option is applicable only for Blob storage, and is only valid when uploading or copying blobs within same storage account.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/SourceKey:&lt;storage-key&gt;</b></td>
    <td>Specifies the storage account key for the source resource.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/SourceSAS:&lt;container-SAS&gt;</b></td>
    <td>Specifies a Shared Access Signature for the source container (if applicable). Surround the SAS with double quotes, as it may contains special command-line characters. 
        <br />
        If neither a key nor a SAS is provided, then the container will be read via anonymous access. 
        <br />
        This option is applicable only for Blob storage.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/S</b></td>
    <td>Specifies recursive mode for copy operations. In recursive mode, AzCopy will copy all blobs or files that match the specified file pattern, including those in subfolders.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/BlobType:&lt;block | page&gt;</b></td>
    <td>Specifies that the destination is a block blob or a page blob. This option is applicable only when the destination is a blob; otherwise, an error is generated. If the destination is a blob and this option is not specified, then by default AzCopy will assume that a block blob is desired.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/CheckMd5</b></td>
    <td>Calculates an MD5 hash for downloaded data and verifies that the MD5 hash stored in the blob or file's Content-MD5 property matches the calculated hash. The MD5 check is turned off by default, so you must specify this option to perform the MD5 check when downloading data.
	<br />
    Note that Azure Storage doesn't guarantee that the MD5 hash stored for the blob or file is up-to-date. It is client's responsibility to update the MD5 whenever the blob or file is modified.
	<br />
    AzCopy always sets the Content-MD5 property for an Azure blob or file after uploading it to the service.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/Snapshot</b></td>
    <td>Indicates whether to transfer snapshots. This option is only valid when the source is a blob. 
        <br />
        The transferred blob snapshots are renamed in this format: [blob-name] (snapshot-time)[extension]. 
        <br />
        By default, snapshots are not copied.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/V:[verbose log-file]</b></td>
    <td>Outputs verbose status messages into a log file. By default, the verbose log file is named <code>AzCopyVerbose.log</code> in <code>%LocalAppData%\Microsoft\Azure\AzCopy</code>. If you specify an existing file location for this option, the verbose log will be appended to that file.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/Z:[journal-file-folder]</b></td>
    <td>Specifies a journal file folder for resuming an operation.<br />
        AzCopy always supports resuming if an operation has been interrupted.<br />
        If this option is not specified, or it is specified without a folder path, then AzCopy will create the journal file in the default location, which is <code>%LocalAppData%\Microsoft\Azure\AzCopy</code>.<br />
        Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.
        <br />
		If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation. 
        <br />
        The journal file is deleted upon successful completion of the operation.
		<br />
		Note that resuming an operation from a journal file created by a previous version of AzCopy is not supported.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/@:response-file</b></td>
    <td>Specifies a file that contains parameters. AzCopy processes the parameters in the file just as if they had been specified on the command line.<br /> 
		In a response file, you can either specify multiple parameters on a single line, or specify each parameter on its own line. Note that an individual parameter cannot span multiple lines. 
        <br />
		Response files can include comments lines that begin with the <code>#</code> symbol. 
        <br />
        You can specify multiple response files. However, note that AzCopy does not support nested response files.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/Y</b></td>
    <td>Suppresses all AzCopy confirmation prompts.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/L</b></td>
    <td>Specifies a listing operation only; no data is copied.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/MT</b></td>
    <td>Sets the downloaded file's last-modified time to be the same as the source blob or file's.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/XN</b></td>
    <td>Excludes a newer source resource. The resource will not be copied if the source is newer than destination.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/XO</b></td>
    <td>Excludes an older source resource. The resource will not be copied if the source resource is older than destination.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/A</b></td>
    <td>Uploads only files that have the Archive attribute set.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/IA:[RASHCNETOI]</b></td>
    <td>Uploads only files that have any of the specified attributes set.<br />
        Available attributes include:  
        <br />
        R&nbsp;&nbsp;&nbsp;Read-only files
        <br />
        A&nbsp;&nbsp;&nbsp;Files ready for archiving
        <br />
        S&nbsp;&nbsp;&nbsp;System files
        <br />
        H&nbsp;&nbsp;&nbsp;Hidden files
        <br />
        C&nbsp;&nbsp;&nbsp;Compressed file
        <br />
        N&nbsp;&nbsp;&nbsp;Normal files
        <br />
        E&nbsp;&nbsp;&nbsp;Encrypted files
        <br />
        T&nbsp;&nbsp;&nbsp;Temporary files
        <br />
        O&nbsp;&nbsp;&nbsp;Offline files
        <br />
        I&nbsp;&nbsp;&nbsp;Non-indexed Files</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/XA:[RASHCNETOI]</b></td>
    <td>Excludes files that have any of the specified attributes set.<br />
        Available attributes include:  
        <br />
        R&nbsp;&nbsp;&nbsp;Read-only files  
        <br />
        A&nbsp;&nbsp;&nbsp;Files ready for archiving  
        <br />
        S&nbsp;&nbsp;&nbsp;System files  
        <br />
        H&nbsp;&nbsp;&nbsp;Hidden files  
        <br />
        C&nbsp;&nbsp;&nbsp;Compressed file  
        <br />
        N&nbsp;&nbsp;&nbsp;Normal files  
        <br />
        E&nbsp;&nbsp;&nbsp;Encrypted files  
        <br />
        T&nbsp;&nbsp;&nbsp;Temporary files  
        <br />
        O&nbsp;&nbsp;&nbsp;Offline files  
        <br />
        I&nbsp;&nbsp;&nbsp;Non-indexed Files</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/Delimiter:&lt;delimiter&gt;</b></td>
    <td>Indicates the delimiter character used to delimit virtual directories in a blob name.<br />
        By default, AzCopy uses / as the delimiter character. However, AzCopy supports using any common character (such as @, #, or %) as a delimiter. If you need to include one of these special characters on the command line, enclose the file name with double quotes. 
        <br />
        This option is only applicable for downloading blobs.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/NC</b></td>
    <td>Specifies the number of concurrent operations. 
        <br />
        The default number is 8 times the number of core processors you are running. So if your computer has 8 cores, by default AzCopy starts 64 concurrent operations.<br />
        Note that large numbers of concurrent operations in a low-bandwidth environment may overwhelm the network connection, preventing the operations from fully completing. Throttle concurrent operations based on actual available network bandwidth.</td>
    <td>Y</td>
    <td>Y</td>
  </tr>
  <tr>
    <td><b>/SourceType:Blob</b></td>
    <td>Specifies that the <code>source</code> resource is a blob available in the local development environment, running in the storage emulator.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
  <tr>
    <td><b>/DestType:Blob</b></td>
    <td>Specifies that the <code>destination</code> resource is a blob available in the local development environment, running in the storage emulator.</td>
    <td>Y</td>
    <td>N</td>
  </tr>
</table>

<br/>

##<a id="limit-writes"></a> Limit concurrent writes while copying data

When you copy blobs or files with AzCopy, keep in mind that another application may be modifying the data while you are copying it. If possible, ensure that the data you are copying is not being modified during the copy operation. For example, when copying a VHD associated with an Azure virtual machine, make sure that no other applications are currently writing to the VHD. Alternately, you can create a snapshot of the VHD first and then copy the snapshot.

If you cannot prevent other applications from writing to blobs or files while they are being copied, then keep in mind that by the time the job finishes, the copied resources may no longer have full parity with the source resources.

##<a id="copy-blobs"></a> Copy Azure blobs with AzCopy

The examples below demonstrate a variety of scenarios for copying blobs with AzCopy.

### Copy a single blob

**Upload a file from the file system to Blob storage:**
	
	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key abc.txt

**Download a blob from Blob storage to the file system:**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key abc.txt

### Copy a blob via server-side copy

When you copy a blob within a storage account or across storage accounts, a server-side copy operation is performed. For more information about server-side copy operations, see [Introducing Asynchronous Cross-Account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/06/12/introducing-asynchronous-cross-account-copy-blob.aspx).

**Copy a blob within a storage account:**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer1 https://myaccount.blob.core.windows.net/mycontainer2 /sourcekey:key /destkey:key abc.txt 

**Copy a blob across storage accounts:**

	AzCopy https://sourceaccount.blob.core.windows.net/mycontainer1 https://destaccount.blob.core.windows.net/mycontainer2 /sourcekey:key1 /destkey:key2 abc.txt
 
### Copy a blob from the secondary region 

If your storage account has read-access geo-redundant storage enabled, then you can copy data from the secondary region. 

**Copy a blob to the primary account from the secondary:**

	AzCopy https://myaccount1-secondary.blob.core.windows.net/mynewcontainer1 https://myaccount2.blob.core.windows.net/mynewcontainer2 /sourcekey:key1 /destkey:key2 abc.txt

**Download a blob in the secondary to a file in the file system:**

	AzCopy https://myaccount-secondary.blob.core.windows.net/mynewcontainer C:\myfolder /sourcekey:key abc.txt

### Upload a file to a new blob container or virtual directory

**Upload a file to a new blob container**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mynewcontainer /destkey:key abc.txt

Note that if the specified destination container does not exist, AzCopy will create it and upload the file into it.

**Upload a file to a new blob virtual directory**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer/vd /destkey:key abc.txt

Note that if the specified virtual directory does not exist, AzCopy will upload the file to include the virtual directory in its name (*e.g.*, `vd/abc.txt` in the example above).

### Download a blob to a new folder

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key abc.txt

If the folder `C:\myfolder` does not yet exist, AzCopy will create it in the file system and download `abc.txt ` into the new folder.

### Upload files and subfolders in a directory to a container, recursively

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key /S

Specifying option `/S` copies the contents of the specified directory to Blob storage recursively, meaning that all subfolders and their files will be copied as well. For instance, assume the following files reside in folder `C:\myfolder`:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\subfolder\a.txt
	C:\myfolder\subfolder\abcd.txt

After the copy operation, the container will include the following files:

    abc.txt
    abc1.txt
    abc2.txt
    subfolder\a.txt
    subfolder\abcd.txt

### Upload files from a directory to a container, non-recursively

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key

If you do not specify option `/S` on the command line, AzCopy will not copy recursively. Only the files in the specified directory are copied; any subfolders and their files are NOT copied. For instance, assume the following files reside in folder `C:\myfolder`:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\subfolder\a.txt
	C:\myfolder\subfolder\abcd.txt

After the copy operation, the container will include the following files:

	abc.txt
	abc1.txt
	abc2.txt

### Download all blobs in a container to a directory in the file system, recursively

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key /S

Assume the following blobs reside in the specified container:  

	abc.txt
	abc1.txt
	abc2.txt
	vd1\a.txt
	vd1\abcd.txt

After the copy operation, the directory `C:\myfolder` will include the following files:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\vd1\a.txt
	C:\myfolder\vd1\abcd.txt

### Download blobs in a virtual blob directory to a directory in the file system, recursively

	AzCopy https://myaccount.blob.core.windows.net/mycontainer/vd1/ C:\myfolder /sourcekey:key /S

Assume the following blobs reside in the specified container:

	abc.txt
	abc1.txt
	abc2.txt
	vd1\a.txt
	vd1\abcd.txt

After the copy operation, the directory `C:\myfolder` will include the following files. Note that only the blobs in the virtual directory are copied:

	C:\myfolder\a.txt
	C:\myfolder\abcd.txt

### Upload files matching the specified file pattern to a container, recursively 

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key a* /S

Assume the following files reside in folder `C:\myfolder`:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt
	C:\myfolder\xyz.txt
	C:\myfolder\subfolder\a.txt
	C:\myfolder\subfolder\abcd.txt

After the copy operation, the container will include the following files:

	abc.txt
	abc1.txt
	abc2.txt
	subfolder\a.txt
	subfolder\abcd.txt
	
### Download blobs with the specified prefix to the file system, recursively

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key a /S

Assume the following blobs reside in the specified container. All blobs beginning with the prefix `a` will be copied:

	abc.txt
	abc1.txt
	abc2.txt
	xyz.txt
	vd1\a.txt
	vd1\abcd.txt

After the copy operation, the folder `C:\myfolder` will include the following files:

	C:\myfolder\abc.txt
	C:\myfolder\abc1.txt
	C:\myfolder\abc2.txt

Note that the prefix applies to the virtual directory, which forms the first part of the blob name. In the example shown above, the virtual directory does not match the specified prefix, so it is not copied.


### Copy a blob and its snapshots to another storage account

	AzCopy https://sourceaccount.blob.core.windows.net/mycontainer1 https://destaccount.blob.core.windows.net/mycontainer2 /sourcekey:key1 /destkey:key2 abc.txt /snapshot

After the copy operation, the target container will include the blob and its snapshots. Assuming the blob in the example above has two snapshots, the container will include the following blob and snapshots:

	abc.txt
	abc (2013-02-25 080757).txt
	abc (2014-02-21 150331).txt


### Use a response file to specify command-line parameters

	AzCopy /@:"C:\myfolder\abc.txt"

You can include any AzCopy command-line parameters in a response file. AzCopy processes the parameters in the file as if they had been specified on the command line, performing a direct substitution with the contents of the file.

**Specify one or more single-line response files**

Assume a response file named `source.txt` that specifies a source container:

	http://myaccount.blob.core.windows.net/mycontainer

And a response file named `dest.txt` that specifies a destination folder in the file system:

	C:\myfolder

And a response file named `options.txt` that specifies options for AzCopy:

	/S /Y

To call AzCopy with these response files, all of which reside in a directory `C:\responsefiles`, use this command:

	AzCopy /@:"C:\responsefiles\source.txt" /@:"C:\responsefiles\dest.txt" /sourcekey:[sourcekey] /@:"C:\responsefiles\options.txt"   

AzCopy processes this command just as it would if you included all of the individual parameters on the command line:

	AzCopy http://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:[sourcekey] /S /Y

**Specify a multi-line response file**

Assume a response file named `copyoperation.txt`, that contains the following lines. Each AzCopy parameter is specified on its own line:

	http://myaccount.blob.core.windows.net/mycontainer
 	C:\myfolder
	/sourcekey:[sourcekey]
	/S 
	/Y

To call AzCopy with this response files, use this command:

	AzCopy /@:"C:\responsefiles\copyoperation.txt"

AzCopy processes this command just as it would if you included all of the individual parameters on the command line:	

	AzCopy http://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:[sourcekey] /S /Y

Note that each AzCopy parameter must be specified all on one line. For example, AzCopy will fail if you split the parameter across two lines, as shown here for the `/sourcekey` parameter:

	http://myaccount.blob.core.windows.net/mycontainer
 	C:\myfolder
	/sourcekey:
	[sourcekey]
	/S 
	/Y

### Specify a shared access signature (SAS)
	
**Specify a SAS for the source container using the /sourceSAS option**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer1 C:\myfolder /sourceSAS:SAS /S

**Specify a SAS for the source container on the source container URI**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer1/?SourceSASToken C:\myfolder /S

**Specify a SAS for the destination container using the /destSAS option**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer1 /destSAS:SAS abc.txt

**Specify a SAS for the source and destination containers**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer1 https://myaccount.blob.core.windows.net/mycontainer2 /sourceSAS:SAS1 /destSAS:SAS2 abc.txt


### Specify a journal file folder

Each time you issue a command to AzCopy, it checks whether a journal file exists in the default folder, or whether it exists in a folder that you specified via this option. If the journal file does not exist in either place, AzCopy treats the operation as new and generates a new journal file.

If the journal file does exist, AzCopy will check whether the command line that you input matches the command line in the journal file. If the two command lines match, AzCopy resumes the incomplete operation. If they do not match, you will be prompted to either overwrite the journal file to start a new operation, or to cancel the current operation. 

**Use the default location for the journal file**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key /Z

If you omit option `/Z`, or specify option `/Z` without the folder path, as shown above, AzCopy creates the journal file in the default location, which is `%SystemDrive%\Users\%username%\AppData\Local\Microsoft\Azure\AzCopy`. If the journal file already exists, then AzCopy resumes the operation based on the journal file. 

**Specify a custom location for the journal file**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key /Z:C:\journalfolder\

This example creates the journal file if it does not already exist. If it does exist, then AzCopy resumes the operation based on the journal file.

**Resume an AzCopy operation**

	AzCopy /Z:C:\journalfolder\

This example resumes the last operation, which may have failed to complete.


### Generate a log file

**Write to the verbose log file in the default location**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key /V

If you specify option `/V` without providing a file path to the verbose log, then AzCopy creates the log file in the default location, which is `%SystemDrive%\Users\%username%\AppData\Local\Microsoft\Azure\AzCopy`.

**Write to the verbose log file in a custom location**

	AzCopy C:\myfolder https://myaccount.blob.core.windows.net/mycontainer /destkey:key /V:C:\myfolder\azcopy1.log

Note that if you specify a relative path following option `/V`, such as `/V:test/azcopy1.log`, then the verbose log is created in the current working directory within a subfolder named `test`.


### Set the last-modified time of downloaded files to be same as the source blobs

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key /MT


### Exclude blobs from the copy operation based on their last-modified time

Specify the `/MT` option to compare the last-modified time of the source blob and the destination file.

**Exclude blobs that are newer than the destination file**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key /MT /XN

**Exclude blobs that are older than the destination file**

	AzCopy https://myaccount.blob.core.windows.net/mycontainer C:\myfolder /sourcekey:key /MT /XO

### Specify the number of concurrent operations to start

Option `/NC` specifies the number of concurrent copy operations. By default, AzCopy will begin concurrent operations at eight times the number of core processors you have. If you are running AzCopy across a low-bandwidth network, you can specify a lower number for this option to avoid failure caused by resource competition.


###	Run AzCopy against blob resources in the storage emulator

	AzCopy https://127.0.0.1:10004/myaccount/myfileshare/ C:\myfolder /SourceKey:key /SourceType:Blob /S


##<a id="copy-files"></a> Copy files in an Azure file share with AzCopy

The examples below demonstrate a variety of scenarios for copying Azure files with AzCopy.

### Download a file from an Azure file share to the file system

	AzCopy https://myaccount.file.core.windows.net/myfileshare/myfolder1/ C:\myfolder /SourceKey:key abc.txt

Note that if the specified source is an Azure file share, then you must either specify the exact file name, (*e.g.* `abc.txt`) to copy a single file, or specify option `/S` to copy all files in the share recursively. Attempting to specify both a file pattern and option `/S` together will result in an error.

### Download files and folders in an Azure file share to the file system, recursively

	AzCopy https://myaccount.file.core.windows.net/myfileshare/ C:\myfolder /SourceKey:key /S

Note that any empty folders will not be copied.


### Upload files and folders from the file system to an Azure file share, recursively

	AzCopy C:\myfolder https://myaccount.file.core.windows.net/myfileshare/ /DestKey:key /S

Note that any empty folders will not be copied.


### Upload files matching the specified file pattern to an Azure file share, recursively

	AzCopy C:\myfolder https://myaccount.file.core.windows.net/myfileshare/ /DestKey:key ab* /S



##<a id="versions"></a> AzCopy versions

| Version | What's New                                                                                      				|
|---------|-----------------------------------------------------------------------------------------------------------------|
| **V2.5.1**  | **Current version. Optimizes performance when using options /xo and /xn. Fixes bugs related to special characters in source file names and journal file corruption after user input the wrong command-line syntax.**	
| V2.5.0  | Optimizes performance for large-scale copy scenarios, and introduces several important usability improvements.	
| V2.4.1  | Supports specifying the destination folder in the installation wizard.                     			
| V2.4.0  | Supports uploading and downloading files for Azure File storage.                       				                              
| V2.3.0  | Supports read-access geo-redundant storage accounts.                                                  			|
| V2.2.2  | Upgraded to use Azure storage client library version 3.0.3.                                            				                    
| V2.2.1  | Fixed performance issue when copying large amount files within same storage account.            				                                                
| V2.2    | Supports setting the virtual directory delimiter for blob names. Supports specifying the journal file path.		|
| V2.1    | Provides more than 20 options to support blob upload, download, and copy operations in an efficient way.		|


##<a id="next-steps"></a> Next steps

For more information about Azure Storage and AzCopy, see the following resources.

### Azure Storage documentation:

- [Introduction to Azure Storage](http://azure.microsoft.com/en-us/documentation/articles/storage-introduction/)
- [Store files in Blob storage](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/)
- [Create an SMB file share in Azure with File storage](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-files/)

### Azure Storage blog posts:

- [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
- [AzCopy 2.5: Optimized for Large-Scale Copy Scenarios](http://go.microsoft.com/fwlink/?LinkId=507682)
- [AzCopy: Support for read-access geo-redundant storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/04/07/azcopy-support-for-read-access-geo-redundant-account.aspx)
- [AzCopy: Transfer data with re-startable mode and SAS token](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/09/07/azcopy-transfer-data-with-re-startable-mode-and-sas-token.aspx)
- [AzCopy: Using cross-account Copy Blob](http://blogs.msdn.com/b/windowsazurestorage/archive/2013/04/01/azcopy-using-cross-account-copy-blob.aspx)
- [AzCopy: Uploading/downloading files for Windows Azure Blobs](http://blogs.msdn.com/b/windowsazurestorage/archive/2012/12/03/azcopy-uploading-downloading-files-for-windows-azure-blobs.aspx)

