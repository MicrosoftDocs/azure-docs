## Quick create defaults

Quick create simplifies the cluster creation process by using hard coded defaults for some configuration choices, and omitting optional configuration settings.

### Default values

| Configuration setting | Hard coded value |
| ----- | ----- |
| Cluster OS | Linux (Ubuntu) |
| HDInsight version | The default version (currently 3.4) |
| Cluster node VM Size | D3 v2 |
| Number of worker nodes | 1 |
| SSH username | sshuser |
| SSH password | The password you enter for Cluster Login |

### Unavailable configuration settings

The following configuration settings are not available when using quick create. If you need to use one of these settings, you must use the full create process.

* The following cluster types are not available when using quick create:

    * R Server

    * Others ???

* Script actions - See [Customize HDInsight using script actions](hdinsight-hadoop-customize-cluster-linux.md) for more information.

* Applications - See [Install HDInsight applications](hdinsight-apps-install-applications.md) for more information.

* Virtual Network - See [Extend HDInsight capabilities by using Azure Virtual Network](hdinsight-extend-hadoop-virtual-network.md) for more information.

    > [AZURE.NOTE] While you cannot specify an Azure Virtual Network during cluster creation, HDInsight internally creates one that is used as a security boundary for the nodes in the cluster. You cannot modify this virtual network.