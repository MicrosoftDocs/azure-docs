---
title: Troubleshoot slow replication or stuck migration in agentless VMware migration
description: Learn how to troubleshoot issues with slow replication or stuck migration for VMware.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.topic: troubleshooting
ms.service: azure-migrate
ms.update:cycle: 365-days
ms.reviewer: v-gajeronika
ms.date: 05/08/2025
ms.custom: vmware-scenario-422, mvc, engagement-fy25
# Customer intent: As a VMware administrator, I want to troubleshoot slow replication or stuck migration, so that I can ensure efficient and timely replication of virtual machines during the migration process.
---

# Troubleshoot slow replication or stuck migration issues in agentless VMware migration 

This article helps you troubleshoot slow replication or stuck migration issues that you may encounter when you replicate on-premises VMware VMs using the Server Migration agentless method.


## Replication is slow or stuck for VM 

While performing replications, you might observe that replication for a particular VM isn't progressing at the expected pace. Generally, the underlying reason for this issue is an unavailability or scarcity of some resources required for replication. The resources might be consumed by other VMs that are replicating or some other process running on the appliance in the datacenter. 

## Expedite and remediate slow or stuck replications using monitoring and expedite tool

1. You can use PowerShell to view **Time Remaining** across **all stages of server migration** in Azure Migrate. This helps you monitor replication progress and remediate slow or stuck replications and plan cutover accurately. You can use PowerShell, Windows PowerShell, or Cloud Shell on Azure portal.
2. Open the Azure portal, and then select Cloud Shell at the upper right of the page. When prompted, select PowerShell.
3. Run this command in Azure Cloud Shell to monitor the migration status of the server you need.

    ```powershell
    
    Get-AzMigrateServerMigrationStatus -ProjectName "<your-project-name>"   -ResourceGroupName "<your-resource-group>" -MachineName "<your-server-name>"

    ```
4. Replace `your-project-name`, `your-resource-group`, and `your-server-name` with the actual Azure Migrate project, resource group, and server name.
5.  You can run the command and get the following output: 

    :::image type="content" source="./media/tutorial-migrate-vmware/run-command.png" alt-text="Screenshot shows the output when you run the command." lightbox="./media/tutorial-migrate-vmware/run-command.png":::

6. The output shows the server replication status, disk progress, time left, upload speed, and datastore details.
7. **Remediate slow or stuck replications using "Expedite" command**: To retrieve appliance operating parameters and a prioritized list of recommended actions that can help reduce the remaining migration time for the specified server and to remediate slow or stuck replications. Run the command with the `Expedite` flag. For guidance on resolving issues identified by the command, see the [Frequent issues section](troubleshoot-replication-vmware.md#frequent-issues-that-cause-slow-or-stuck-replications).
    ```powershell

    Get-AzMigrateServerMigrationStatus -ProjectName "<your-project-name>"   -ResourceGroupName "<your-resource-group>" -MachineName "<your-server-name>" -Expedite 

    ```

8. You get the following output: 
    
  :::image type="content" source="./media/tutorial-migrate-vmware/server-migration.png"alt-text="Screenshot shows the output of the server migration status. "lightbox="./media/tutorial-migrate-vmware/server-migration.png":::
    
9. You can run the command without `-MachineName` parameter to view migration status and time remaining for all servers in the project. For example: 

    ```powershell

    Get-AzMigrateServerMigrationStatus -ProjectName "<your-project-name>" -ResourceGroupName "<your-resource-group>"
    ```
10. Replace `your-project-name` and `your-resource-group` with the actual Azure Migrate project and resource group names.
11. You run this command and get the following output: <br /><br />

    :::image type="content" source="./media/tutorial-migrate-vmware/replication-status.png"alt-text="Screenshot shows the overall replication status. "lightbox="./media/tutorial-migrate-vmware/replication-status.png":::
12. If there's a problem with replication or cutover, the `-Health` flag shows **errors, possible causes, and recommended actions** to troubleshoot the migration.

```powershell
    
    Get-AzMigrateServerMigrationStatus   -ProjectName "<your-project-name>"   -ResourceGroupName "<your-resource-group>"   -            MachineName "<your-server-name>" -Health
```
13. You run this command and get the following output: <br /><br />

:::image type="content" source="./media/tutorial-migrate-vmware/replication-complete.png" alt-text="Screenshot shows the               replication complete status." lightbox="./media/tutorial-migrate-vmware/replication-complete.png":::

14. To view the migration status, time remaining, and health details for **all servers connected to that appliance**, run the command with only `-ApplianceName`.

```powershell
   Get-AzMigrateServerMigrationStatus -ProjectName "<your-project-name>"   -ResourceGroupName "<your-resource-group>" -                ApplianceName "<your-appliance-
 ```
15. Replace `your-project-name`, `your-resource-group`, and `your-appliance-name` with the actual values from your Azure Migrate setup.

16. Run this command to get the following output: <br /><br />

:::image type="content" source="./media/tutorial-migrate-vmware/appliance-name.png" alt-text="Screenshot shows Azure Migrate server migration status." lightbox="./media/tutorial-migrate-vmware/appliance-name.png":::

>[!NOTE]
> You can run the above commands in Azure Cloud Shell. You can also use PowerShell or Windows PowerShell on any Windows machine. A machine refers to any Windows PC, not an appliance, or server, as long as it has access to the Azure Migrate project.

## Frequent issues that cause slow or stuck replications

### NFC buffer size low 

The Azure Migrate appliance operates under the constraint of using 32 MB of NFC buffer to concurrently replicate 8 disks on the ESXi host. An NFC buffer size of less than 32 MB might cause slow replication. 
You may also get the following exception:  

Exception: GatewayErrorHandling.GatewayServiceException: The operation failed with the error 'Memory allocation failed. Out of memory.'  

#### Remediation

You can increase the NFC buffer size beyond 32 MB to increase concurrency. The setting needs to be done on both the ESXi host and on the appliance. If not, the replication may perform even worse. 

> [!Caution]
> Increasing the size to more than 32 MB might cause resource constraints in the environment. Before proceeding, consult with the System Administrator to understand the implications. 

**Changes in ESXi host** 

1. SSH to the ESXi host as root. 
2. Use the vi editor to open “/etc/vmware/hostd/config.xml”. 
3. Find the section that looks like the one below:

   ```
   <nfcsvc> 
   <enabled>true</enabled> 
   <maxMemory>134217728</maxMemory> 
   <maxStreamMemory>10485760</maxStreamMemory> 
   <path>libnfcsvc.so</path> 
   </nfcsvc> 
   ```
4. Edit the value of `maxMemory` to the value (in Bytes) that you’d like to configure for the NFC buffer. In this example, it's set to 128 MB (128 * 1024 * 1024). 
5. Save and exit. 
6. Restart the management agents from the shell using the following commands: 
   - /etc/init.d/hostd restart 
   - /etc/init.d/vpxa restart 

**Changes in Appliance**  

1. Sign in to the Azure Migrate appliance as an administrator using the Remote Desktop.
2. Open the GatewayDataWorker.json file in the "%programdata%\Microsoft Azure\Config" folder.  
3. Create an empty json file if it doesn’t exist and paste the following text in the new file created. 
   ```
   { 
    "HostBufferSizeInMB": "32", 
   } 
   ```
4. Change the value of `HostBufferSizeInMB` to the value that you set in the ESXi host. 
5. Save and exit. 
6. Restart the Azure Migrate gateway service that is running on the appliance. Go to PowerShell and execute the following:
   - net stop asrgwy (wait for the service to stop) 
   - net start asrgwy  

 
### ESXi host available RAM low 

When the ESXi host on which the replicating VM is present is too busy, the replication process will slow down due to unavailability of RAM. 

#### Remediation

Use VMotion to move the VM with slow replication to an ESXi host, which isn't too busy. 

### Network bandwidth  

Replications might be slow because of low network bandwidth available to the Azure Migrate appliance. Low bandwidth might be due to other applications using up the bandwidth or presence of bandwidth throttling applications or a proxy setting restricting the bandwidth use of replication appliance.  

#### Remediation

In case of low bandwidth, you can first reduce the number of applications using network bandwidth. Check with your network administrator if any throttling application or proxy setting is present. 

### Disk I/O 

Replications can be slow because the server that is being replicated has too much load on it and this is causing high I/O operations on disks attached to it. It's advised to reduce the load on the server to increase the replication speed. You may also encounter the following error: 

The last replication cycle for the virtual machine ‘VM Name’ failed. Encountered timeout event. 

If no action is taken, the replication will proceed and be completed with a delay. 

### Disk write rates 

Replications can be slower than expected if the data upload speed is higher than the write speed of the disk that you selected while enabling replication. To get better speeds at same upload speeds, you would need to restart the replication and select **Premium** while selecting the disk type for replication.  

> [!Caution]
> The disk type recommended during Assessment might not be **Premium** for a particular VM. In this case, switching to Premium disk to improve replication speeds isn't advisable since it might not be required post migration to have a Premium disk attached to this VM. 


## Migration operation on VM is stuck 

While triggering migration for a particular VM, you might observe that the migration is stuck at some stage (queued or delta sync) longer than expected. Generally, the underlying reason for this issue is an unavailability or scarcity of some resources required for migration. The resources might be consumed by other VMs that are replicating or some other process running on appliance on in the datacenter. Following are some reasons that generally cause this issue and the remedies. 

### NFC buffer size low 

If an IR cycle for a server with large disks is ongoing while migration is triggered for second VM, the second VM’s migration job can get stuck. Even though migration jobs are given high priority, the NFC buffer might not be available for migration. In this case, it's recommended to stop or pause the initial replication of servers with large disks and complete the migration of the second VM. 

### Ongoing delta sync cycle isn't complete 

If migration is triggered during an ongoing delta replication cycle, it would be queued. The delta replication cycle on the VM will be completed first after which migration will start. The time required to trigger migration depends on the time taken to complete one delta sync cycle. 

### Shutdown of on-premises VM taking longer than usual

Try to migrate without shutting down the VM or turn off the VM manually and then migrate it. 

## Next steps
[Learn more](tutorial-migrate-vmware.md) about migrating VMware VMs.

