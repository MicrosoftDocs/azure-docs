<properties linkid="manage-services-hdinsight-debug-jobs" urlDisplayName="HDInsight Administration" pageTitle="Debug HDInsight - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" description="Learn how to debug the Windows Azure HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" title="Debug HDInsight: error messages" />

# Debug HDInsight: error messages

The error messages itemized in this topic are provided to help the users of Windows Azure HDInsight understand possible error conditions that they can encounter when administering the service using Windows Azure PowerShell and to advise them on the steps which can be taken to recover from the error.

Some of these error mssages could also be seen in the Windows Azure portal when used manage HDinsight clusters. But other error messages you might encounter there are less granular due to the constraints on the remedial actions possible in this context. Other error messages are provided in the contexts where the mitigation is obvious. If the constraints on paramters are violated, for example, the message pops-up in on the right side of the box where the value was entered. Here is a case where too many data nodes have been requested. The remedy is to reduce the number to an allowed value that is 22 or less.

![HDI.Debug.ErrorMessages.Portal][image-hdi-error-message]

The errors a user can encounter in Windows Azure PowerShell or in the Windows Azure Portal are listed alphabetically by name. The discription and mitigation of Errors are also provided.

## HDInsight Errors

- **AtleastOneSqlMetastoreMustBeProvided**

	**Description**: Please provide Azure SQL database details for at least one component in order to use custom settings for Hive and Oozie metastores.

	**Mitigation**: The user needs to supply a valid SQL Azure metastore and retry the request.
	
- **AzureRegionNotSupported**

	**Description**: Could not create cluster in region nameOfYourRegion. Use a valid HDInsight region and retry request.

	**Mitigation**: Customer should create the cluster region that currently supports them: Southeast Asia, North Europe, West Europe, East US, or West US.

- **ClusterContainerRecordNotFound**

	**Description**: The server could not find the requested cluster record.

	**Mitigation**: Retry the operation.
	
- **ClusterDnsNameInvalidReservedWord**

	**Description**: Cluster DNS name yourDnsName is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character

	**Mitigation**: Make sure that you have used a valid DNS name for your cluster that starts and ends with alphanumeric and contains no special characters other than the dash '-' and then retry the operation.
	
- **ClusterNameUnavailable**
	
	**Description**: Cluster name yourClusterName is unavailable. Please pick another name.

	**Mitigation**: The user should specify a clustername that is unique and does not exist and retry. If the user is using the portal, the UI will notify them if a cluster name is already being used during the create steps.

- **ClusterPasswordInvalid**

	**Description**: Cluster password is invalid. Password must be at least 10 characters long and must contain at least one number, uppercase letter, lowercase letter and special character with no spaces and should not contain the username as part of it.
	
	**Mitigation**: Provie a valid cluster password and retry the operation.

- **ClusterUserNameInvalid**

	**Description**: Cluster username is invalid. Please ensure username doesn't contain special characters or spaces.

	**Mitigation**: Provide a valid cluster username and retry the operation.

- **ClusterUserNameInvalidReservedWord**

	**Description**: Cluster DNS name yourDnsClusterName is invalid. Please ensure name starts and ends with alphanumeric and can only contain '-' special character
	
	**Mitigation**: Provide a valid DNS cluster username and retry the operation.

- **ContainerNameMisMatchWithDnsName**

	**Description**: Container name in URI yourcontainerURI and DNS name yourDnsName in request body must be the same.

	**Mitigation**: Make sure that your container Name and your DNS name are the same and retry the operation.

- **DataNodeDefinitionNotFound**

	**Description**: Invalid cluster configuration. Unable to find any data node definitions in node size.

	**Mitigation**: Retry the operation.

- **DeploymentDeletionFailure**

	**Description**: Deletion of deployment failed for the Cluster.

	**Mitigation**: Retry the delete operation.

- **DnsMappingNotFound**

	**Description**: Service configuration error. Required DNS mapping information not found.
	
	**Mitigation**: Delete cluster and create a new cluster.

- **DuplicateClusterContainerRequest**

	**Description**: Duplicate cluster container creation attempt. Record exists for nameOfYourContainer but Etags do not match.

	**Mitigation**: Provide a unique name for the container and retry the create operation.

- **DuplicateClusterInHostedService**

	**Description**: Hosted service nameOfYourHostedService already contains a cluster. A hosted service cannot contain multiple clusters

	**Mitigation**: Host the cluster in another hosted service.

- **FailureToUpdateDeploymentStatus**

	**Description**: The server could not update the state of the cluster deployment.

	**Mitigation**: Retry the operation. If this happens multiple times, contact CSS.

- **HdiRestoreClusterAltered**

	**Description**: Cluster yourClusterName was deleted as part of maintenance. Please recreate the cluster.

	**Mitigation**: Recreate the cluster.

- **HeadNodeConfigNotFound**

	**Description**: Invalid cluster configuration. Required head node configuration not found in node sizes.

	**Mitigation**: Retry the operation.

- **HostedServiceCreationFailure**

	**Description**: Unable to create hosted service nameOfYourHostedService. Please retry request.
	
	**Mitigation**: Retry the request.

- **HostedServiceHasProductionDeployment**

	**Description**: Hosted Service nameOfYourHostedService already has a production deployment. A hosted service cannot contain multiple production deployments. Retry the request with a different cluster name.

	**Mitigation**: Use a different cluster name and retry the request.

- **HostedServiceNotFound**

	**Description**: Hosted Service nameOfYourHostedService for the cluster could not be found.

	**Mitigation**: If the cluster is in error state, delete it and then try again.

- **HostedServiceWithNoDeployment**

	**Description**: Hosted Service nameOfYourHostedService has no associated deployment.

	**Mitigation**: If the cluster is in error state, delete it and then try again.

- **InsufficientResourcesCores**

	**Description**: The SubscriptionId yourSubscriptionId does not have cores left to create cluster yourClusterName. Required: resourcesRequired, Available: resourcesAvailable.

	**Mitigation**: Free up resources in your subscription or increase the resources available to the subscription and try to create the cluster again.

- **InsufficientResourcesHostedServices**

	**Description**: Subscription ID yourSubscriptionId does not have quota for a new HostedService to create cluster yourClusterName.

	**Mitigation**: Free up resources in your subscription or increase the resources available to the subscription and try to create the cluster again.

- **InternalErrorRetryRequest**

	**Description**: The server encountered an internal error. Please retry request.

	**Mitigation**: Retry the request.

- **InvalidAzureStorageLocation**

	**Description**: Azure Storage location dataRegionName is not a valid location. Make sure the region is correct and retry request.

	**Mitigation**: Select a Storage location that supports HDInsight, check that your cluster is co-located and retry the operation.

- **InvalidNodeSizeForDataNode**

	**Description**: Invalid VM size for data nodes. Only 'Large VM' size is supported for all data nodes.

	**Mitigation**: Specify the supported node size for the data node and retry the operation.

- **InvalidNodeSizeForHeadNode**

	**Description**: Invalid VM size for head node. Only 'ExtraLarge VM' size is supported for head node.

	**Mitigation**: Specify the supported node size for the head node and retry the operation

- **InvalidRightsForDeploymentDeletion**

	**Description**: Subscription ID yourSubscriptionId being used does not have sufficient permissions to execute delete operation for cluster yourClusterName.

	**Mitigation**: If the cluster is in error state, drop it and then try again.

- **InvalidStorageAccountBlobContainerName**

	**Description**: External storage account blob container name yourContainerName is invalid. Make sure name starts with a letter and contains only lowercase letters, numbers and dash.

	**Mitigation**: Specify a valid storage account blob container name and retry the operation.

- **InvalidStorageAccountConfigurationSecretKey**

	**Description**: Configuration for external storage account yourStorageAccountName is required to have secret key details to be set.

	**Mitigation**: Specify a valid secret key for the storage account and retry the operation.

- **InvalidVersionHeaderFormat**

	**Description**: Version header yourVersionHeader is not in valid format of yyyy-mm-dd.

	**Mitigation**: Specify a valid format for the version-header and retry the request.

- **MoreThanOneHeadNode**

	**Description**: Invalid cluster configuration. Found more than one head node configuration.
	**Mitigation**: Edit the configuration so that onloy one head node is specified.

- **OperationTimedOutRetryRequest**

	**Description**: The operation could not be completed within the permitted time or the maximum retry attempts possible. Please retry request.

	**Mitigation**: Retry the request.

- **ParameterNullOrEmpty**

	**Description**: Parameter yourParameterName cannot be null or empty.

	**Mitigation**: Specify a valid value for the parameter.

- **PreClusterCreationValidationFailure**

	**Description**: One or more of the cluster creation request inputs is not valid. Make sure the input values are correct and retry request.

	**Mitigation**: Make sure the input values are correct and retry request.

- **RegionCapabilityNotAvailable**

	**Description**: Region capability not available for region yourRegionName and Subscription ID yourSubscriptionId.

	**Mitigation**: Specify a region that supports HDInsight clusters. The publicly supported regions are: Southeast Asia, North Europe, West Europe, East US, or West US.

- **StorageAccountNotColocated**

	**Description**: Storage account yourStorageAccountName is in region currentRegionName. It should be same as the cluster region yourClusterRegionName.

	**Mitigation**: Either specify a storage account in the same region that your cluster is in or if your data is already in the storage account, create a new cluster in the same region as the existing storage account. If you are using the portal, the UI will notify them of this issue in advance.

- **SubscriptionIdNotActive**

	**Description**: Given Subscription ID yourSubscriptionId is not active.

	**Mitigation**: Re-activate your subscription or get a new valid subscription.

- **SubscriptionIdNotFound**

	**Description**: Subscription ID yourSubscriptionId could not be found.
	
	**Mitigation**: Check that your subscription ID is valid and retry the operation.

- **UnableToResolveDNS**

	**Description**: Unable to resolve DNS yourDnsUrl. Please ensure the fully qualified URL for the blob endpoint is provided.

	**Mitigation**: Supply a valid blob URL. The URL MUST be fully valid, including starting with http:// and ending in .com. The fully qualified URL can usually be found in the storage tab of the manage.windowsazure.com portal.

- **UnableToVerifyLocationOfResource**

	**Description**: Unable to verify location of resource yourDnsUrl. Please ensure the fully qualified URL for the blob endpoint is provided.

	**Mitigation**: Supply a valid blob URL. The URL MUST be fully valid, including starting with http:// and ending in .com. The fully qualified URL can usually be found in the storage tab of the manage.windowsazure.com portal.

- **VersionCapabilityNotAvailable**

	**Description**: Version capability not available for version specifiedVersion and Subscription ID yourSubscriptionId.
	
	**Mitigation**: Choose a version that is available and retry the operation.

- **VersionNotSupported**

	**Description**: Version specifiedVersion not supported.

	**Mitigation**: Choose a version that is supported and retry the operation.

- **VersionNotSupportedInRegion**

	**Description**: Version specifiedVersion is not available in Azure region specifiedRegion.

	**Mitigation**: Choose a version that is supported in the region specified and retry the operation.

- **WasbAccountConfigNotFound**

	**Description**: Invalid cluster configuration. Required WASB account configuration not found in external accounts.

	**Mitigation**: Verify that the account exists and is properly specified in configuration and retry the operation.


##<a name="resources"></a>Additional Debugging Resources

- [Windows Azure HDInsight SDK documentation](http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx)




[image-hdi-error-message]: ./media/hdinsight-debug-jobs/HDI.Debug.ErrorMessages.Portal.png
