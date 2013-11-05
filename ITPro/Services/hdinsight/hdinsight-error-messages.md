<properties linkid="manage-services-hdinsight-debug-error-messages" urlDisplayName="Debug HDInsight Errors" pageTitle="Debug HDInsight: Error Messages" metaKeywords="hdinsight, hdinsight service, hdinsight azure, debug, error messages, errors" metaDescription="Error messages to debug Windows Azure HDInsight." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# Debug HDInsight: Error Messages

##Introduction
The error messages itemized in this topic are provided to help the users of Windows Azure HDInsight understand possible error conditions that they can encounter when administering the service using Windows Azure PowerShell and to advise them on the steps which can be taken to recover from the error. 

**Note**: If you are using the Windows Azure portal to manage HDinsight clusters, the error messages you could encounter there are less granular that the ones itemized here. But the errors here map into the errors that a user can encounter in the portal.

The errors a user can encounter in Windows Azure PowerShell are listed alphabetically by name in the [HDInsight Errors](#hdinsight-error-messages) section where they are linked to an entry in the [Diagnosis and Mitigation of Errors](#diagnosis-mitigation-errors) section that provide the following infomation for the error:
 	
- **Description**: the error message users see	
- **Root Cause**: diagnosis of potential caues of the error	
- **Investigation**: advice on how to diagnose the error	
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



<h2><a id="diagnosis-mitigation-errors"></a>Diagnosis and Mitigation of Errors</h2> 


<h3><a id="AtleastOneSqlMetastoreMustBeProvided"></a>AtleastOneSqlMetastoreMustBeProvided</h3>
- **Description**: Please provide Azure SQL database details for at least one component in order to use custom settings for Hive and Oozie metastores.  
- **Root Cause**: No SQL Metastore information was provided by the customer. The user must specify a valid SQL DB to use as the metastores for Hive and Oozie. 
- **Investigation**: Check HdInsightLogEntryVer5v0 filtered on ClusterDnsName field and look in the details field. There should be more information if this was a different issue. 
- **Mitigation**: The user needs to supply a valid SQL Azure metastore and retry the request.  

<h3><a id="AzureRegionNotSupported"></a>AzureRegionNotSupported</h3>
- **Description**: Could not create cluster in region '{0}'. Use a valid HDInsight region and retry request.   
- **Root Cause**: Create request was received for a region that does not support HDInsight. 
- **Investigation**: Check HdInsightLogEntryVer5v0 filtered on ClusterDnsName field.  
- **Mitigation**: Customer should create the cluster in a supported region: North Europe, East US, 0r West US.  

<h3><a id="ClusterContainerRecordNotFound"></a>ClusterContainerRecordNotFound</h3>
- **Description**: The server could not find the requested cluster record.  
- **Root Cause**: The service was unable to communicate with the internal SQL Azure DB that stores the state of all clusters in the system.  
- **Investigation**: Check HdInsightLogEntryVer5v0 filtered on ClusterDnsName field in the Details field. There should be a detailed error message that will tell you what happened. 
- **Mitigation**: Retry the operation. 

<h3><a id="ClusterDnsNameInvalidReservedWord"></a>ClusterDnsNameInvalidReservedWord</h3>
- **Description**: Cluster DNS name '{0}' is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="ClusterNameUnavailable"></a>ClusterNameUnavailable</h3>
- **Description**: Cluster name '{0}' is unavailable. Please pick another name.  
- **Root Cause**: The cluster name must be unique. If the user specifies a cluster name that is already being used they will see this error.   
- **Investigation**: None needed. 
- **Mitigation**: The user should specify a clustername that does not exist and retry. If the user is using the portal, the UI will notify them if a cluster name is already being used during the create steps. 
 

<h3><a id="ClusterPasswordInvalid"></a>ClusterPasswordInvalid</h3>
- **Description**: Cluster password is invalid. Password must be at least 10 characters long and must contain at least one number, uppercase letter, lowercase letter and special character with no spaces and should not contain the username as part of it.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="ClusterUserNameInvalid"></a>ClusterUserNameInvalid</h3>
- **Description**: Cluster username is invalid. Please ensure username doesn't contain special characters or spaces.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="ClusterUserNameInvalidReservedWord"></a>ClusterUserNameInvalidReservedWord</h3>
- **Description**: Cluster DNS name '{0}' is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="ContainerNameMisMatchWithDnsName"></a>ContainerNameMisMatchWithDnsName</h3>
- **Description**: Container name in URI '{0}' and DNS name '{1}' in request body must be the same.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="DataNodeDefinitionNotFound"></a>DataNodeDefinitionNotFound</h3>
- **Description**: Invalid cluster configuration. Unable to find any data node definitions in node size.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="DeploymentDeletionFailure"></a>DeploymentDeletionFailure</h3> 	
- **Description**: Deletion of deployment failed for the Cluster  
- **Root Cause**: Deletion of cluster failed for unknown reason. 
- **Investigation**: Check HdInsightLogEntryVer5v0 filtered on ClusterDnsName field. 
- **Mitigation**: Retry delete. File CRI for DevOps to force delete manually using DevOps dashboard if the user is unable to delete. 

<h3><a id="DnsMappingNotFound"></a>DnsMappingNotFound</h3> 
- **Description**: Service configuration error. Required DNS mapping information not found. 
- **Root Cause**: Unable to apply DNS name to cluster. 
- **Investigation**: Check HdInsightLogEntryVer5v0 filtered on ClusterDnsName field. 
- **Mitigation**: Delete cluster and recreate 

<h3><a id="DuplicateClusterContainerRequest"></a>DuplicateClusterContainerRequest</h3>
- **Description**: Duplicate cluster container creation attempt. Record exists for '{0}' but Etags do not match.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="DuplicateClusterInHostedService"></a>DuplicateClusterInHostedService</h3>
- **Description**: Hosted service '{0}' already contains a cluster. A hosted service cannot contain multiple clusters  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="FailureToUpdateDeploymentStatus"></a>FailureToUpdateDeploymentStatus</h3>
- **Description**: The server could not update the state of the cluster deployment.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HdiRestoreClusterAltered"></a>HdiRestoreClusterAltered</h3>
- **Description**: Cluster '{0}' was deleted as part of maintenance. Please recreate the cluster.    
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HeadNodeConfigNotFound"></a>HeadNodeConfigNotFound</h3>
- **Description**: Invalid cluster configuration. Required head node configuration not found in node sizes.
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HostedServiceCreationFailure"></a>HostedServiceCreationFailure</h3>
- **Description**: Unable to create hosted service '{0}'. Please retry request.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HostedServiceHasProductionDeployment"></a>HostedServiceHasProductionDeployment</h3>
- **Description**: Hosted Service '{0}' already has a production deployment. hosted service cannot contain multiple production deployments. Retry the request with a different cluster name.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HostedServiceNotFound"></a>HostedServiceNotFound</h3>
- **Description**: Hosted Service '{0}' for the cluster could not be found.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="HostedServiceWithNoDeployment"></a>HostedServiceWithNoDeployment</h3>
- **Description**: Hosted Service '{0}' has no associated deployment.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InsufficientResourcesCores"></a>InsufficientResourcesCores</h3>
- **Description**: ser SubscriptionId '{0}' does not have cores left to create cluster '{1}'. Required: {2}, Available: {3}.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InsufficientResourcesHostedServices"></a>InsufficientResourcesHostedServices</h3>
- **Description**: Subscription ID '{0}' does not have quota for a new HostedService to create cluster '{1}'.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InternalErrorRetryRequest"></a>InternalErrorRetryRequest</h3>
- **Description**: The server encountered an internal error. Please retry request.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidAzureStorageLocation"></a>InvalidAzureStorageLocation</h3>
- **Description**: Azure Storage location '{0}' is not a valid location. Make sure the region is correct and retry request.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidNodeSizeForDataNode"></a>InvalidNodeSizeForDataNode</h3>
- **Description**: Invalid VM size for data nodes. Only 'Large VM' size is supported for all data nodes.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidNodeSizeForHeadNode"></a>InvalidNodeSizeForHeadNode</h3>
- **Description**: Invalid VM size for head node. Only 'ExtraLarge VM' size is supported for head node.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidRightsForDeploymentDeletion"></a>InvalidRightsForDeploymentDeletion</h3>
- **Description**: Subscription ID '{0}' being used does not have sufficient permissions to execute delete operation for cluster '{1}'.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidStorageAccountBlobContainerName"></a>InvalidStorageAccountBlobContainerName</h3>
- **Description**: External storage account blob container name '{0}' is invalid. Make sure name starts with a letter and contains only lowercase letters, numbers and dash.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidStorageAccountConfigurationSecretKey"></a>InvalidStorageAccountConfigurationSecretKey</h3>
- **Description**: Configuration for external storage account '{0}' is required to have secret key details to be set.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="InvalidVersionHeaderFormat"></a>InvalidVersionHeaderFormat</h3>
- **Description**: Version header '{0}' is not in valid format of yyyy-mm-dd.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="MoreThanOneHeadNode"></a>MoreThanOneHeadNode</h3>
- **Description**: Invalid cluster configuration. Found more than one head node configuration.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="OperationTimedOutRetryRequest"></a>OperationTimedOutRetryRequest</h3>
- **Description**: The operation could not be completed within the permitted time or the maximum retry attempts possible. Please retry request.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="ParameterNullOrEmpty"></a>ParameterNullOrEmpty</h3>
- **Description**: Parameter '{0}' cannot be null or empty.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="PreClusterCreationValidationFailure"></a>PreClusterCreationValidationFailure</h3>
- **Description**: One or more of the cluster creation request inputs is not valid. Make sure the input values are correct and retry request.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="RegionCapabilityNotAvailable"></a>RegionCapabilityNotAvailable</h3>
- **Description**: Region capability not available for region '{0}' and Subscription ID '{1}'.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="StorageAccountNotColocated"></a>StorageAccountNotColocated</h3>
- **Description**: Storage account '{0}' is in region '{1}'. It should be same as the cluster region '{2}'.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="SubscriptionIdNotActive"></a>SubscriptionIdNotActive</h3>
- **Description**: Given Subscription ID '{0}' is not active.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="SubscriptionIdNotFound"></a>SubscriptionIdNotFound</h3>
- **Description**: Subscription ID '{0}' could not be found.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="UnableToResolveDNS"></a>UnableToResolveDNS</h3>
- **Description**: Unable to resolve DNS '{0}'. Please ensure the fully qualified URL for the blob endpoint is provided.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="UnableToVerifyLocationOfResource"></a>UnableToVerifyLocationOfResource</h3>
- **Description**: Unable to verify location of resource '{0}'. Please ensure the fully qualified URL for the blob endpoint is provided.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="VersionCapabilityNotAvailable"></a>VersionCapabilityNotAvailable</h3>
- **Description**: Version capability not available for version '{0}' and Subscription ID '{1}'.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="VersionNotSupported"></a>VersionNotSupported</h3>
- **Description**: Version '{0}' not supported.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="VersionNotSupportedInRegion"></a>VersionNotSupportedInRegion</h3>
- **Description**: Version '{0}' is not available in Azure region '{1}'. 
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 

<h3><a id="WasbAccountConfigNotFound"></a>WasbAccountConfigNotFound</h3>
- **Description**: Invalid cluster configuration. Required WASB account configuration not found in external accounts.  
- **Root Cause**: tbd 
- **Investigation**: tbd 
- **Mitigation**: tbd 


<h2><a id="AdditionalDebugResources"></a>Additional Debug Resources</h2> 
TBD







