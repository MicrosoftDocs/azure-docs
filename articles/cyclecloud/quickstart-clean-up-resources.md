# Azure CycleCloud QuickStart 4: Clean Up Resources

## Terminate the Cluster

When all submitted jobs are complete, you no longer need the cluster. To clean up resources and free them for other jobs, click **Terminate** in the CycleCloud GUI to shut down all of the infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

(screeeeeenshot)

## Delete the Resource Group

To remove the resources you created for the QuickStart, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process:

      az group delete --name "{RESOURCE GROUP}"

Using the example created in the first QuickStart:

      az group delete --name "CCLab"

## Delete the Service Principal

Run the following command to delete the service principal created at the start of the lab, substituting the name used if other than the example name:

	 az ad sp delete --id "http://CCLab"

If you've gone through all four QuickStarts, you've covered the installation, setup, and configuration of Azure CycleCloud, created and ran a simple HPC cluster, added a cost usage alert, submitted 100 jobs, witnessed the auto scaling, and cleaned up after yourself. You've only begun to scratch the surface of what Azure CycleCloud offers - check out the product and documentation pages to learn more!
