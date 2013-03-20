<properties linkid="manage-services-hdinsight-programmatic-deploy" urlDisplayName="Deploying HDInsight Programmatically" pageTitle="Deploying an HDInsight Cluster Programmatically - Windows Azure Services" metaKeywords="hdinsight deploy, hdinsight deployment, programmatic deployment, hdinsight azure" metaDescription="Deploying an HDInsight Cluster Programmatically" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Deploying an HDInsight Service Cluster Programmatically

HDInsight Service clusters can be created programmatically by issuing an authenticated call to the [Service Management API](http://msdn.microsoft.com/en-us/library/windowsazure/ee460799.aspx).  As the HDInsight Service moves through preview, we will add full support and documentation on this capability prior to general availability.  

Authentication needs to occur via the management certificate as outlined in [this documentation](http://msdn.microsoft.com/en-us/library/windowsazure/ee460782.aspx).

The following URI path forms the base for operations on the Windows Azure HDInsight Service:

	https://management.core.windows.net/subscription-id/cloudservices/azurehdinsight

It is important to note that at this time, one must create a cluster via the Windows Azure management portal at least once prior to using the programmatic endpoints.

##Operations on HDInsight Service Clusters

- [List Clusters](#list)
- [Create Clusters](#create)
- [Delete Clusters](#delete)

##<a name="list"></a>List Clusters

By issuing a GET against the base URI above, you will receive a body that enumerates the set of clusters that are currently running.  The response body contains:

    <CloudService xmlns="http://schemas.microsoft.com/windowsazure" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <Name>azurehdinsight</Name>
      <Label>HdInsight CloudService</Label>
      <Description>HdInsight clusters for subscription ... </Description>
      <GeoRegion>georegion</GeoRegion>
      <Resources>
        <Resource>
          <ResourceProviderNamespace>azurehdinsight</ResourceProviderNamespace>
          <Type>containers</Type>
          <Name>resource_name</Name>
          <OutputItems>
            <OutputItem>
              <Key>ConnectionURL</Key>
              <Value>https://clustername.azurehdinsight.net</Value>
            </OutputItem>
            <OutputItem>
              <Key>ClusterUsername</Key>
              <Value>admin</Value>
            </OutputItem>
            <OutputItem>
              <Key>Version</Key>
              <Value>version_id</Value>
            </OutputItem>
            <OutputItem>
              <Key>ClusterLocation</Key>
              <Value>location_value</Value>
            </OutputItem>
            <OutputItem>
              <Key>NodesCount</Key>
              <Value>node_count</Value>
            </OutputItem>
          </OutputItems>
          <OperationStatus>
            <Type>Create</Type>
            <Result>Succeeded</Result>
          </OperationStatus>
        </Resource>
      </Resources>
    </CloudService>



##<a name="create"></a>Create Clusters

In order to create a cluster, issue a PUT against the following URI: 

     https://management.core.windows.net/<subscriptionId>/cloudservices/azurehdinsight/resources/azurehdinsight/containers/<containerName>

The body of your request must contain the following payload. 

<div class="dev-callout"> 
<b>Note</b> 
<p>The format for this will evolve.</p> 
</div>

    <?xml version="1.0" encoding="utf-8"?>
    <Resource xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/windowsazure">
      <IntrinsicSettings>
        <ClusterContainer xmlns="http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess.Context"
                          xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
          <AzureStorageLocation>East US</AzureStorageLocation>
          <Deployment>
            <ASVAccounts>
              <ASVAccount>
                <AccountName>##azurestorageaccount##</AccountName>
                <BlobContainerName>##containername##</BlobContainerName>
                <SecretKey>##storagekey##</SecretKey>
              </ASVAccount>
            </ASVAccounts>
            <ClusterPassword>##password##</ClusterPassword>
            <ClusterUsername>##username##</ClusterUsername>
            <NodeSizes>
              <ClusterNodeSize>
                <Count>1</Count>
                <RoleType>HeadNode</RoleType>
                <VMSize>ExtraLarge</VMSize>
              </ClusterNodeSize>
              <ClusterNodeSize>
                <Count>##clustersize##</Count>
                <RoleType>DataNode</RoleType>
                <VMSize>Large</VMSize>
              </ClusterNodeSize>
            </NodeSizes>
            <Version>default</Version>
          </Deployment>
          <DeploymentAction>Create</DeploymentAction>
          <DnsName>##name##</DnsName>
          <SubscriptionId>##subscription##</SubscriptionId>
        </ClusterContainer>
      </IntrinsicSettings>
    </Resource>

There are a few parameters which are important to explain here:

* **ASVAccounts**: Details on the storage account(s) to connect to the cluster.  You can provide multiple storage accounts here, if you do this, you will need to fully qualify references to the other storage accounts in order to reference them from jobs on the cluster.
* **ClusterUsername**: This will form the logon information for the cluster for RDP, as well as the basic authentication against the gateway and cluster dashboard.  The cluster password must be 8 characters long, and contain at least one numeric, special character and capital letter.
* **NodeSizes**: Note, node size is currently *not* configurable.  In a future update, we will enable the ability to specify the node sizes fully.  Currently, the only settable parameter which will be honored here is the **clustersize**.
* **DNSName**: This needs to match the name of the cluster

Optionally, following node size, you can specify a SQL Database to be the persistent metadata store for Hive and Oozie.  Please co-locate this database with the Windows Azure HDInsight Service Cluster.  **It is important to note that both of these must be provided (an error will result if only one value is provided).**

      <SqlMetaStores xmlns:da="http://schemas.datacontract.org/2004/07/Microsoft.ClusterServices.DataAccess">
        <da:SqlAzureMetaStore>
          <da:AzureServerName>dbserver.database.windows.net</da:AzureServerName>
          <da:DatabaseName>dbname</da:DatabaseName>
          <da:Password>password</da:Password>
          <da:Type>HiveMetastore</da:Type>
          <da:Username>username</da:Username>
        </da:SqlAzureMetaStore>
        <da:SqlAzureMetaStore>
          <da:AzureServerName>dbserver.database.windows.net</da:AzureServerName>
          <da:DatabaseName>dbname</da:DatabaseName>
          <da:Password>password</da:Password>
          <da:Type>OozieMetastore</da:Type>
          <da:Username>username</da:Username>
        </da:SqlAzureMetaStore>
      </SqlMetaStores>

<div class="dev-callout"> 
<b>Note</b> 
<p>The elements *must* be placed in alphabetical order.</p> 
</div>

##<a name="delete"></a>Delete Clusters

In order to delete a cluster, issue a DELETE against the following URI:

    https://management.core.windows.net/<subscriptionId>/cloudservices/azurehdinsight/resources/azurehdinsight/containers/<containerName>

##Summary

As demonstrated in this article, you can perform basic management tasks for the Windows Azure HDInsight Service by using the REST API.

##Next Steps

In this article you learned how to programmatically list, create, and delete an HDInsight Service cluster. For steps on using the Windows Azure Management Portal to perform these actions, see [How To: Administer HDInsight][hdinsight-admin].

[hdinsight-admin]: /en-us/manage/services/hdinsight/howto-administer-hdinsight/