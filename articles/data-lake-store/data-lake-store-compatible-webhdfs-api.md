<properties 
   pageTitle="WebHDFS APIs that are supported with Data Lake Store | Azure" 
   description="List of WebHDFS APIs that work with Azure Data Lake Store" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/28/2015"
   ms.author="nitinme"/>

# WebHDFS APIs compatible with Azure Data Lake Store

[ TBD: Add some blurb on swebhdfs and webhdfs and how it's implemented for ADL ]

| Standard HDFS API            | WebHDFS API with Data Lake Store | Request/Response | Important considerations |
|------------------------------|----------------------------|------------------|----|
| FileSystem.create            | CREATE                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File)| The following request parameters are not supported: <ul><li><b>blocksize</b> - This is fixed at 256MB and cannot be changed</li><li><b>replication</b> - This is handled internally by Data Lake Store and is not supported</li><li><b>buffersize</b> - This is fixed at 4MB and cannot be changed</li></ul>The following request parameters are supported differently:<ul><li><b>permission</b> - This can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.append            | APPEND                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Append_to_a_File) |The following request parameters are not supported: <ul><li><b>buffersize</b> - This is fixed at 4MB and cannot be changed</li></ul>|
| FileSystem.concat            | CONCAT                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Concat_Files)|Data Lake Store has added a parameter called **MSCONCAT** that enables adding the entire URI as part of the HTTP request body|
| FileSystem.open              | OPEN                       | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File)| The following request parameters are not supported: <ul><li><b>buffersize</b> - This is fixed at 4MB and cannot be changed</li></ul>|
| FileSystem.mkdirs            | MKDIRS                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory) | The following request parameters are supported differently: <ul><li><b>permission</b> - This can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.rename            | RENAME                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory)| - |
| FileSystem.delete            | DELETE                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory)         | - |
| FileSystem.getFileStatus     | GETFILESTATUS              | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Status_of_a_FileDirectory)         | The following response parameters are not supported: <ul><li><b>fileId</b> - This is not supported</li></ul>The following request parameters are supported differently:<ul><li><b>permission</b> - This can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.listStatus        | LISTSTATUS                 | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#List_a_Directory)         | The following response parameters are not supported: <ul><li><b>fileId</b> - This is not supported</li></ul>The following request parameters are supported differently:<ul><li><b>permission</b> - This can be set only at the root level of the folder structure.</li></ul>|
|                              | GET_BLOCK_LOCATION         |                  |
| FileSystem.getContentSummary | GETCONTENTSUMMARY          | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Content_Summary_of_a_Directory)         | The following response parameters are not supported: <ul><li><b>quota</b> - This is not supported because this cannot be set on a secure store.</li><li><b>spaceQuota</b> - This is not supported because this cannot be set on a secure store.</li></ul>|
| FileSystem.getHomeDirectory  | GETHOMEDIRECTORY           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Home_Directory)         | - |
| FileSystem.setPermission     | SETPERMISSION              | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Permission)| The following request parameters are supported differently: <ul><li><b>permission</b> - This can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.setOwner          | SETOWNER                   | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Owner)| The following request parameters are supported differently: <ul><li><b>owner</b> - This can only be set at the root level of the folder structure.</li><b>group</b> - This can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.modifyAclEntries  | MODIFYACLENTRIES           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Modify_ACL_Entries)| The following request parameters are supported differently: <ul><li><b>aclspec</b> - The ACLs can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.removeAclEntries  | REMOVEACLENTRIES           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Remove_ACL_Entries)| The following request parameters are supported differently: <ul><li><b>aclspec</b> - The ACLs can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.setAcl            | SETACL                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_ACL)| The following request parameters are supported differently: <ul><li><b>aclspec</b> - The ACLs can be set only at the root level of the folder structure.</li></ul>|
| FileSystem.getAclStatus      | GETACLSTATUS               | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_ACL_Status)| - |
| FileSystem.access            | CHECKACCESS                | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Check_access)         | - |
## See also

- [Open Source Big Data applications compatible with Azure Data Lake Store](data-lake-store-compatible-oss-other-applications.md)
 
