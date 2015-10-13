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
   ms.date="10/27/2015"
   ms.author="nitinme"/>

# WebHDFS APIs compatible with Azure Data Lake Store

[ TBD: Add some blurb on swebhdfs and webhdfs and how it's implemented for ADL ]

| Standard HDFS API            | WebHDFS API with Data Lake | Request/Response |
|------------------------------|----------------------------|------------------|
| FileSystem.create            | CREATE                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File)|
| FileSystem.append            | APPEND                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Append_to_a_File) |
| FileSystem.concat            | CONCAT                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Concat_Files)|
| FileSystem.open              | OPEN                       | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File)|
| FileSystem.mkdirs            | MKDIRS                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory) |
| FileSystem.rename            | RENAME                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory)|
| FileSystem.delete            | DELETE                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory)         |
| FileSystem.getFileStatus     | GETFILESTATUS              | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Status_of_a_FileDirectory)         |
| FileSystem.listStatus        | LISTSTATUS                 | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#List_a_Directory)         |
|                              | GET_BLOCK_LOCATION         |                  |
| FileSystem.getContentSummary | GETCONTENTSUMMARY          | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Content_Summary_of_a_Directory)         |
| FileSystem.getHomeDirectory  | GETHOMEDIRECTORY           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_Home_Directory)         |
| FileSystem.setPermission     | SETPERMISSION              | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Permission)|
| FileSystem.setOwner          | SETOWNER                   | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_Owner)|
| FileSystem.modifyAclEntries  | MODIFYACLENTRIES           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Modify_ACL_Entries)|
| FileSystem.removeAclEntries  | REMOVEACLENTRIES           | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Remove_ACL_Entries)|
| FileSystem.setAcl            | SETACL                     | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Set_ACL)|
| FileSystem.getAclStatus      | GETACLSTATUS               | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Get_ACL_Status)|
| FileSystem.access            | CHECKACCESS                | See [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Check_access)         |
## See also

- [Open Source Big Data applications compatible with Azure Data Lake Store](data-lake-store-compatible-oss-other-applications.md)
 
