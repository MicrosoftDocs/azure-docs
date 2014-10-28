<properties urlDisplayName="Debug HDInsight Hadoop Errors" pageTitle="Debug Hadoop in HDInsight: Error messages | Azure" metaKeywords="hdinsight, hdinsight service, hdinsight azure, debug, error messages, errors" description="Learn about the error messages you might receive when administering HDInsight using PowerShell, and steps you can take to recover." services="hdinsight" title="Debug Hadoop in HDInsight: Error messages" umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" authors="bradsev" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="bradsev" />

# Debug Hadoop in HDInsight: Error messages

##Introduction
The error messages itemized in this topic are provided to help the users of Hadoop in Azure HDInsight understand possible error conditions that they can encounter when administering the service using Azure PowerShell and to advise them on the steps which can be taken to recover from the error. 

Some of these error messages could also be seen in the Azure portal when it is used to manage HDInsight clusters. But other error messages you might encounter there are less granular due to the constraints on the remedial actions possible in this context. Other error messages are provided in the contexts where the mitigation is obvious. If the constraints on parameters are violated, for example, the message pops-up in on the right side of the box where the value was entered. Here is a case where too many data nodes have been requested. The remedy is to reduce the number to an allowed value that is 22 or less.

![HDI.Debugging.ErrorMessages.Portal][image-hdi-debugging-error-messages-portal]

The errors a user can encounter in Azure PowerShell or in the Azure Portal are listed alphabetically by name in the [HDInsight Errors](#hdinsight-error-messages) section where they are linked to an entry in the [Discription and Mitigation of Errors](#discription-mitigation-errors) section that provide the following information for the error:
 	
- **Description**: the error message users see	
- **Mitigation**: what steps can be taken to recover from the error. 

###HDInsight Errors

[AtleastOneSqlMetastoreMustBeProvided](#AtleastOneSqlMetastoreMustBeProvided)
[AzureRegionNotSupported](#AzureRegionNotSupported)		
[ClusterContainerRecordNotFound](#ClusterContainerRecordNotFound)	 
[ClusterDnsNameInvalidReservedWord](#ClusterDnsNameInvalidReservedWord)		
[ClusterNameUnavailable](#ClusterNameUnavailable)	
[ClusterUserNameInvalid](#ClusterUserNameInvalid)	
[ClusterUserNameInvalidReservedWord](#ClusterUserNameInvalidReservedWord)	
[ContainerNameMisMatchWithDnsName](#ContainerNameMisMatchWithDnsName)	
[DataNodeDefinitionNotFound](#DataNodeDefinitionNotFound)	
[DeploymentDeletionFailure](#DeploymentDeletionFailure)	
[DnsMappingNotFound](#DnsMappingNotFound)	
[DuplicateClusterContainerRequest](#DuplicateClusterContainerRequest)	
[DuplicateClusterInHostedService](#DuplicateClusterInHostedService)		
[FailureToUpdateDeploymentStatus](#FailureToUpdateDeploymentStatus)		
[HdiRestoreClusterAltered](#HdiRestoreClusterAltered)	
[HeadNodeConfigNotFound](#HeadNodeConfigNotFound)	
[HeadNodeConfigNotFound](#HeadNodeConfigNotFound)	 
[HostedServiceCreationFailure](#HostedServiceCreationFailure)	
[HostedServiceHasProductionDeployment](#HostedServiceHasProductionDeployment)	
[HostedServiceNotFound](#HostedServiceNotFound)		
[HostedServiceWithNoDeployment](#HostedServiceWithNoDeployment)		
[InsufficientResourcesCores](#InsufficientResourcesCores)	
[InsufficientResourcesHostedServices](#InsufficientResourcesHostedServices)		
[InternalErrorRetryRequest](#InternalErrorRetryRequest)		
[InvalidAzureStorageLocation](#InvalidAzureStorageLocation)		
[InvalidNodeSizeForDataNode](#InvalidNodeSizeForDataNode)	
[InvalidNodeSizeForHeadNode](#InvalidNodeSizeForHeadNode)	
[InvalidRightsForDeploymentDeletion](#InvalidRightsForDeploymentDeletion)	
[InvalidStorageAccountBlobContainerName](#InvalidStorageAccountBlobContainerName)	
[InvalidStorageAccountConfigurationSecretKey](#InvalidStorageAccountConfigurationSecretKey)	
[InvalidVersionHeaderFormat](#InvalidVersionHeaderFormat)	
[MoreThanOneHeadNode](#MoreThanOneHeadNode)	
[OperationTimedOutRetryRequest](#OperationTimedOutRetryRequest)	
[ParameterNullOrEmpty](#ParameterNullOrEmpty)	
[PreClusterCreationValidationFailure](#PreClusterCreationValidationFailure)	
[RegionCapabilityNotAvailable](#RegionCapabilityNotAvailable)	
[StorageAccountNotColocated](#StorageAccountNotColocated)	
[SubscriptionIdNotActive](#SubscriptionIdNotActive)	
[SubscriptionIdNotFound](#SubscriptionIdNotFound)	
[UnableToResolveDNS](#UnableToResolveDNS)	
[UnableToVerifyLocationOfResource](#UnableToVerifyLocationOfResource)	
[VersionCapabilityNotAvailable](#VersionCapabilityNotAvailable)	
[VersionNotSupported](#VersionNotSupported)	
[VersionNotSupportedInRegion](#VersionNotSupportedInRegion)	
[WasbAccountConfigNotFound](#WasbAccountConfigNotFound)	



<h2><a id="discription-mitigation-errors"></a>Diagnosis and Mitigation of Errors</h2> 


<h3><a id="AtleastOneSqlMetastoreMustBeProvided"></a>AtleastOneSqlMetastoreMustBeProvided</h3>
- **Description**: Please provide Azure SQL database details for at least one component in order to use custom settings for Hive and Oozie metastores.   
- **Mitigation**: The user needs to supply a valid SQL Azure metastore and retry the request.  

<h3><a id="AzureRegionNotSupported"></a>AzureRegionNotSupported</h3>
- **Description**: Could not create cluster in region *nameOfYourRegion*. Use a valid HDInsight region and retry request.   
- **Mitigation**: Customer should create the cluster region that currently supports them: Southeast Asia, West Europe, North Europe, East US, or West US.  

<h3><a id="ClusterContainerRecordNotFound"></a>ClusterContainerRecordNotFound</h3>
- **Description**: The server could not find the requested cluster record.  
- **Mitigation**: Retry the operation. 

<h3><a id="ClusterDnsNameInvalidReservedWord"></a>ClusterDnsNameInvalidReservedWord</h3>
- **Description**: Cluster DNS name *yourDnsName* is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character  
- **Mitigation**: Make sure that you have used a valid DNS name for your cluster that starts and ends with alphanumeric and contains no special characters other than the dash '-' and then retry the operation.

<h3><a id="ClusterNameUnavailable"></a>ClusterNameUnavailable</h3>
- **Description**: Cluster name *yourClusterName* is unavailable. Please pick another name.  
- **Mitigation**: The user should specify a clustername that is unique and does not exist and retry. If the user is using the portal, the UI will notify them if a cluster name is already being used during the create steps. 
 

<h3><a id="ClusterPasswordInvalid"></a>ClusterPasswordInvalid</h3>
- **Description**: Cluster password is invalid. Password must be at least 10 characters long and must contain at least one number, uppercase letter, lowercase letter and special character with no spaces and should not contain the username as part of it.  
- **Mitigation**: Provide a valid cluster password and retry the operation. 

<h3><a id="ClusterUserNameInvalid"></a>ClusterUserNameInvalid</h3>
- **Description**: Cluster username is invalid. Please ensure username doesn't contain special characters or spaces.  
- **Mitigation**: Provide a valid cluster username and retry the operation.

<h3><a id="ClusterUserNameInvalidReservedWord"></a>ClusterUserNameInvalidReservedWord</h3>
- **Description**: Cluster DNS name *yourDnsClusterName* is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character  
- **Mitigation**: Provide a valid DNS cluster username and retry the operation.

<h3><a id="ContainerNameMisMatchWithDnsName"></a>ContainerNameMisMatchWithDnsName</h3>
- **Description**: Container name in URI *yourcontainerURI* and DNS name *yourDnsName* in request body must be the same.  
- **Mitigation**: Make sure that your container Name and your DNS name are the same and retry the operation.

<h3><a id="DataNodeDefinitionNotFound"></a>DataNodeDefinitionNotFound</h3>
- **Description**: Invalid cluster configuration. Unable to find any data node definitions in node size.  
- **Mitigation**: Retry the operation.

<h3><a id="DeploymentDeletionFailure"></a>DeploymentDeletionFailure</h3> 	
- **Description**: Deletion of deployment failed for the Cluster  
- **Mitigation**: Retry the delete operation.

<h3><a id="DnsMappingNotFound"></a>DnsMappingNotFound</h3> 
- **Description**: Service configuration error. Required DNS mapping information not found.  
- **Mitigation**: Delete cluster and create a new cluster.

<h3><a id="DuplicateClusterContainerRequest"></a>DuplicateClusterContainerRequest</h3>
- **Description**: Duplicate cluster container creation attempt. Record exists for *nameOfYourContainer* but Etags do not match.   
- **Mitigation**: Provide a unique name for the container and retry the create operation. 

<h3><a id="DuplicateClusterInHostedService"></a>DuplicateClusterInHostedService</h3>
- **Description**: Hosted service *nameOfYourHostedService* already contains a cluster. A hosted service cannot contain multiple clusters  
- **Mitigation**: Host the cluster in another hosted service. 

<h3><a id="FailureToUpdateDeploymentStatus"></a>FailureToUpdateDeploymentStatus</h3>
- **Description**: The server could not update the state of the cluster deployment.  
- **Mitigation**: Retry the operation. If this happens multiple times, contact CSS. 

<h3><a id="HdiRestoreClusterAltered"></a>HdiRestoreClusterAltered</h3>
- **Description**: Cluster *yourClusterName* was deleted as part of maintenance. Please recreate the cluster.     
- **Mitigation**: Recreate the cluster.

<h3><a id="HeadNodeConfigNotFound"></a>HeadNodeConfigNotFound</h3>
- **Description**: Invalid cluster configuration. Required head node configuration not found in node sizes.
- **Mitigation**: Retry the operation.

<h3><a id="HostedServiceCreationFailure"></a>HostedServiceCreationFailure</h3>
- **Description**: Unable to create hosted service *nameOfYourHostedService*. Please retry request.  
- **Mitigation**: Retry the request.

<h3><a id="HostedServiceHasProductionDeployment"></a>HostedServiceHasProductionDeployment</h3>
- **Description**: Hosted Service *nameOfYourHostedService* already has a production deployment. A hosted service cannot contain multiple production deployments. Retry the request with a different cluster name.   
- **Mitigation**: Use a different cluster name and retry the request.

<h3><a id="HostedServiceNotFound"></a>HostedServiceNotFound</h3>
- **Description**: Hosted Service *nameOfYourHostedService* for the cluster could not be found.  
- **Mitigation**: If the cluster is in error state, delete it and then try again. 

<h3><a id="HostedServiceWithNoDeployment"></a>HostedServiceWithNoDeployment</h3>
- **Description**: Hosted Service *nameOfYourHostedService* has no associated deployment.  
- **Mitigation**: If the cluster is in error state, delete it and then try again. 

<h3><a id="InsufficientResourcesCores"></a>InsufficientResourcesCores</h3>
- **Description**: The SubscriptionId *yourSubscriptionId* does not have cores left to create cluster *yourClusterName*. Required: *resourcesRequired*, Available: *resourcesAvailable*.  
- **Mitigation**: Free up resources in your subscription or increase the resources available to the subscription and try to create the cluster again.

<h3><a id="InsufficientResourcesHostedServices"></a>InsufficientResourcesHostedServices</h3>
- **Description**: Subscription ID *yourSubscriptionId* does not have quota for a new HostedService to create cluster *yourClusterName*.  
- **Mitigation**: Free up resources in your subscription or increase the resources available to the subscription and try to create the cluster again.

<h3><a id="InternalErrorRetryRequest"></a>InternalErrorRetryRequest</h3>
- **Description**: The server encountered an internal error. Please retry request.  
- **Mitigation**: Retry the request. 

<h3><a id="InvalidAzureStorageLocation"></a>InvalidAzureStorageLocation</h3>
- **Description**: Azure Storage location *dataRegionName* is not a valid location. Make sure the region is correct and retry request.   
- **Mitigation**: Select a Storage location that supports HDInsight, check that your cluster is co-located and retry the operation. 

<h3><a id="InvalidNodeSizeForDataNode"></a>InvalidNodeSizeForDataNode</h3>
- **Description**: Invalid VM size for data nodes. Only 'Large VM' size is supported for all data nodes.  
- **Mitigation**: Specify the supported node size for the data node and retry the operation. 

<h3><a id="InvalidNodeSizeForHeadNode"></a>InvalidNodeSizeForHeadNode</h3>
- **Description**: Invalid VM size for head node. Only 'ExtraLarge VM' size is supported for head node.  
- **Mitigation**: Specify the supported node size for the head node and retry the operation

<h3><a id="InvalidRightsForDeploymentDeletion"></a>InvalidRightsForDeploymentDeletion</h3>
- **Description**: Subscription ID *yourSubscriptionId* being used does not have sufficient permissions to execute delete operation for cluster *yourClusterName*.  
- **Mitigation**: If the cluster is in error state, drop it and then try again.  

<h3><a id="InvalidStorageAccountBlobContainerName"></a>InvalidStorageAccountBlobContainerName</h3>
- **Description**: External storage account blob container name *yourContainerName* is invalid. Make sure name starts with a letter and contains only lowercase letters, numbers and dash.  
- **Mitigation**: Specify a valid storage account blob container name and retry the operation.

<h3><a id="InvalidStorageAccountConfigurationSecretKey"></a>InvalidStorageAccountConfigurationSecretKey</h3>
- **Description**: Configuration for external storage account *yourStorageAccountName* is required to have secret key details to be set.  
- **Mitigation**: Specify a valid secret key for the storage account and retry the operation.

<h3><a id="InvalidVersionHeaderFormat"></a>InvalidVersionHeaderFormat</h3>
- **Description**: Version header *yourVersionHeader* is not in valid format of yyyy-mm-dd.  
- **Mitigation**: Specify a valid format for the version-header and retry the request. 

<h3><a id="MoreThanOneHeadNode"></a>MoreThanOneHeadNode</h3>
- **Description**: Invalid cluster configuration. Found more than one head node configuration.  
- **Mitigation**: Edit the configuration so that onloy one head node is specified. 

<h3><a id="OperationTimedOutRetryRequest"></a>OperationTimedOutRetryRequest</h3>
- **Description**: The operation could not be completed within the permitted time or the maximum retry attempts possible. Please retry request.  
- **Mitigation**: Retry the request. 

<h3><a id="ParameterNullOrEmpty"></a>ParameterNullOrEmpty</h3>
- **Description**: Parameter *yourParameterName* cannot be null or empty.  
- **Mitigation**: Specify a valid value for the parameter. 

<h3><a id="PreClusterCreationValidationFailure"></a>PreClusterCreationValidationFailure</h3>
- **Description**: One or more of the cluster creation request inputs is not valid. Make sure the input values are correct and retry request.  
- **Mitigation**: Make sure the input values are correct and retry request. 

<h3><a id="RegionCapabilityNotAvailable"></a>RegionCapabilityNotAvailable</h3>
- **Description**: Region capability not available for region *yourRegionName* and Subscription ID *yourSubscriptionId*.  
- **Mitigation**: Specify a region that supports HDInsight clusters. The publicly supported regions are: Southeast Asia, West Europe, North Europe, East US, or West US. 

<h3><a id="StorageAccountNotColocated"></a>StorageAccountNotColocated</h3>
- **Description**: Storage account *yourStorageAccountName* is in region *currentRegionName*. It should be same as the cluster region *yourClusterRegionName*.  
- **Mitigation**: Either specify a storage account in the same region that your cluster is in or if your data is already in the storage account, create a new cluster in the same region as the existing storage account. If you are using the portal, the UI will notify them of this issue in advance. 

<h3><a id="SubscriptionIdNotActive"></a>SubscriptionIdNotActive</h3>
- **Description**: Given Subscription ID *yourSubscriptionId* is not active.  
- **Mitigation**: Re-activate your subscription or get a new valid subscription.

<h3><a id="SubscriptionIdNotFound"></a>SubscriptionIdNotFound</h3>
- **Description**: Subscription ID *yourSubscriptionId* could not be found.  
- **Mitigation**: Check that your subscription ID is valid and retry the operation. 

<h3><a id="UnableToResolveDNS"></a>UnableToResolveDNS</h3>
- **Description**: Unable to resolve DNS *yourDnsUrl*. Please ensure the fully qualified URL for the blob endpoint is provided.  
- **Mitigation**: Supply a valid blob URL. The URL MUST be fully valid, including starting with *http://* and ending in *.com*. The fully qualified URL can usually be found in the storage tab of the manage.windowsazure.com portal.  

<h3><a id="UnableToVerifyLocationOfResource"></a>UnableToVerifyLocationOfResource</h3>
- **Description**: Unable to verify location of resource *yourDnsUrl*. Please ensure the fully qualified URL for the blob endpoint is provided.  
- **Mitigation**: Supply a valid blob URL. The URL MUST be fully valid, including starting with *http://* and ending in *.com*. The fully qualified URL can usually be found in the storage tab of the manage.windowsazure.com portal. 

<h3><a id="VersionCapabilityNotAvailable"></a>VersionCapabilityNotAvailable</h3>
- **Description**: Version capability not available for version *specifiedVersion* and Subscription ID *yourSubscriptionId*.  
- **Mitigation**: Choose a version that is available and retry the operation. 

<h3><a id="VersionNotSupported"></a>VersionNotSupported</h3>
- **Description**: Version *specifiedVersion* not supported.   
- **Mitigation**: Choose a version that is supported and retry the operation.

<h3><a id="VersionNotSupportedInRegion"></a>VersionNotSupportedInRegion</h3>
- **Description**: Version *specifiedVersion* is not available in Azure region *specifiedRegion*.  
- **Mitigation**: Choose a version that is supported in the region specified and retry the operation. 

<h3><a id="WasbAccountConfigNotFound"></a>WasbAccountConfigNotFound</h3>
- **Description**: Invalid cluster configuration. Required WASB account configuration not found in external accounts.  
- **Mitigation**: Verify that the account exists and is properly specified in configuration and retry the operation. 

<h2><a id="resources"></a>Additional Debugging Resources</h2> 

* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[image-hdi-debugging-error-messages-portal]: ./media/hdinsight-debug-jobs/hdi-debug-errormessages-portal.png






