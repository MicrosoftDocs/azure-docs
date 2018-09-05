| Resource | Free | Shared | Basic | Standard | Premium (v2) | Isolated </th> |
| --- | --- | --- | --- | --- | --- | --- |
| [Web, mobile, or API apps](https://azure.microsoft.com/services/app-service/) per [App Service plan](../articles/app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md)<sup>1</sup> |10 |100 |Unlimited<sup>2</sup> |Unlimited<sup>2</sup> |Unlimited<sup>2</sup> |Unlimited<sup>2</sup>|
| [App Service plan](../articles/app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) |1 per region |10 per resource group |100 per resource group |100 per resource group |100 per resource group |100 per resource group|
| Compute instance type |Shared |Shared |Dedicated<sup>3</sup> |Dedicated<sup>3</sup> |Dedicated<sup>3</sup></p> |Dedicated<sup>3</sup>|
| [Scale-Out](../articles/app-service/web-sites-scale.md) (max instances) |1 shared |1 shared |3 dedicated<sup>3</sup> |10 dedicated<sup>3</sup> |20 dedicated<sup>3</sup>|100 dedicated<sup>4</sup>|
| Storage<sup>5</sup> |1 GB<sup>5</sup> |1 GB<sup>5</sup> |10 GB<sup>5</sup> |50 GB<sup>5</sup> |250 GB<sup>5</sup></p> |1 TB<sup>5</sup>|
| CPU time (5 min)<sup>6</sup> |3 minutes |3 minutes |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a>|
| CPU time (day)<sup>6</sup> |60 minutes |240 minutes |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |
| Memory (1 hour) |1024 MB per App Service plan |1024 MB per app |N/A |N/A |N/A |N/A |
| Bandwidth |165 MB |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |
| Application architecture |32-bit |32-bit |32-bit/64-bit |32-bit/64-bit |32-bit/64-bit |32-bit/64-bit |
| Web Sockets per instance<sup>7</sup> |5 |35 |350 |Unlimited |Unlimited |Unlimited |
| Concurrent [debugger connections](../articles/app-service/web-sites-dotnet-troubleshoot-visual-studio.md) per application |1 |1 |1 |5 |5 |5 |
| Custom domain [SSL support](../articles/app-service/app-service-web-tutorial-custom-ssl.md) |Not supported. Wildcard certificate for *.azurewebsites.net available by default.|Not supported. Wildcard certificate for *.azurewebsites.net available by default.|Unlimited SNI SSL connections |Unlimited SNI SSL and 1 IP SSL connections included |Unlimited SNI SSL and 1 IP SSL connections included | Unlimited SNI SSL and 1 IP SSL connections included|
| Integrated Load Balancer | |X |X |X |X |X<sup>9</sup> |
| [Always On](../articles/app-service/web-sites-configure.md) | | |X |X |X |X |
| [Scheduled Backups](../articles/app-service/web-sites-backup.md) | | | | Scheduled backups every 2 hours, a max of 12 backups per day (manual + scheduled) | Scheduled backups every hour, a max of 50 backups per day (manual + scheduled) | Scheduled backups every hour, a max of 50 backups per day (manual + scheduled) |
| [Auto Scale](../articles/app-service/web-sites-scale.md) | | | |X |X |X |
| [WebJobs](../articles/app-service/web-sites-create-web-jobs.md)<sup>8</sup> |X |X |X |X |X |X |
| [Azure Scheduler](https://azure.microsoft.com/services/scheduler/) support | |X |X |X |X |X |
| [Endpoint monitoring](../articles/app-service/web-sites-monitor.md) | | |X |X |X |X |
| [Staging Slots](../articles/app-service/web-sites-staged-publishing.md) | | | |5 |20 |20 |
| Custom domains per app</a> |0 (azurewebsites.net subdomain only)|500 |500 |500 |500 |500 |
| SLA | |  |99.9% |99.95%|99.95%|99.95%|

<sup>1</sup>Apps and storage quotas are per App Service plan unless noted otherwise.  
<sup>2</sup>The actual number of apps that you can host on these machines depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.  
<sup>3</sup>Dedicated instances can be of different sizes. See [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/) for more details.  
<sup>4</sup>More allowed upon request.
<sup>5</sup>The storage limit is the total content size across all apps in the
same App Service plan. More storage options are available in [App Service Environment](../articles/app-service/environment/app-service-web-configure-an-app-service-environment.md#storage)  
<sup>6</sup>These resources are constrained by physical resources on the dedicated instances (the instance size and the number of instances).  
<sup>7</sup>If you scale an app in the Basic tier to two instances, you have 350 concurrent connections for each of the two instances.  
<sup>8</sup>Run custom executables and/or scripts on demand, on a schedule, or continuously as a background task within your App Service instance. Always On is required for continuous WebJobs execution. Azure Scheduler Free or Standard is required for scheduled WebJobs. There is no predefined limit on the number of WebJobs that can run in an App Service instance, but there are practical limits that depend on what the application code is trying to do.   
<sup>9</sup>App Service Isolated SKUs have the ability to be internally load balanced (ILB) with Azure Load Balancer, which means no public connectivity from the internet. As a result, some features of an ILB Isolated App Service must be used from machines that have direct access to the ILB network endpoint.