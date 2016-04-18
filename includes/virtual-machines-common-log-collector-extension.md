
Diagnosing issues with an Microsoft Azure cloud service requires collecting the service’s log files on virtual machines as the issues occur. You can use the AzureLogCollector extension on-demand to perfom one-time collection of logs from one or more Cloud Service VMs (from both web roles and worker roles) and transfer the collected files to an Azure storage account – all without remotely logging on to any of the VMs.
> [AZURE.NOTE]Descriptions for most of the logged information can be found at http://blogs.msdn.com/b/kwill/archive/2013/08/09/windows-azure-paas-compute-diagnostics-data.asp.

There are two modes of collection dependent on the types of files to be collected.
- Azure Guest Agent Logs only (GA). This collection mode includes all the logs related to Azure guest agents and other Azure components.
- All Logs (Full). This collection mode will collect all files in GA mode plus:

  - system and application event logs
  
  - HTTP error logs
  
  - IIS Logs
  
  - Setup logs
  
  - other system logs

In both collection modes, additional data collection folders can be specified by using a collection of the following structure:

- **Name**: The name of the collection, which will be used as the name of subfolder inside the zip file to be collected.

- **Location**: The path to the folder on the virtual machine where file will be collected.

- **SearchPattern**: The pattern of the names of files to be collected. Default is “*”

- **Recursive**: if the files will be collected recursively under the folder.
