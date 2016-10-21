> [AZURE.IMPORTANT] HDInsight clusters come in a variety of types, which correspond to the workload or technology that the cluster is tuned for. There is no supported method to create a cluster that combines multiple types, such as Storm and HBase on one cluster. 

If your solution requires technologies that are spread across multiple HDInsight cluster types, you should create an Azure Virtual Network and create the required cluster types within the virtual network. This allows the clusters, and any code you deploy to them, to directly communicate with each other.

For more information on using an Azure Virtual Network with HDInsight, see [Extend HDInsight with Azure Virtual Networks](../articles/hdinsight/hdinsight-extend-hadoop-virtual-network.md).

For an example of using two cluster types within an Azure Virtual Network, see [Analyze sensor data with Storm and HBase](../articles/hdinsight/hdinsight-storm-sensor-data-analysis.md).

