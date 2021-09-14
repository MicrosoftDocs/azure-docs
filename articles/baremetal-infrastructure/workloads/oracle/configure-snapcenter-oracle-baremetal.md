---
title: Configure SnapCenter for Oracle on BareMetal Infrastructure
description: Learn how to configure SnapCenter for Oracle on BareMetal Infrastructure.
ms.topic: how-to
ms.subservice: baremetal-oracle
ms.date: 05/05/2021
---

# Configure SnapCenter for Oracle on BareMetal Infrastructure

In this article, we'll walk through the steps to configure NetApp SnapCenter to run Oracle on BareMetal Infrastructure.

## Add storage hosts to SnapCenter

First, let's add storage hosts to SnapCenter. 

When you start the SnapCenter session and save the security exemption, the application will start up. Sign in to SnapCenter on your virtual machine (VM) using Active Directory credentials.

https://\<hostname\>:8146/

Now you're ready to add both a production storage location and a secondary storage location.

### Add the production storage location

To add your production storage virtual machine (SVM):

1. Select **Storage Systems** in the left menu and select **+ New**.

2. Enter the **Add Storage System** information:

      - Storage System: Enter the SVM IP address provided by Microsoft Operations.
      - Enter username created; the default is **snap center**.
      - Enter the password created when Microsoft Operations [modified customer password using REST](set-up-snapcenter-to-route-traffic.md#steps-to-integrate-snapcenter).
      - Leave **Send Autosupport notification for failed operations to storage system** unchecked.
      - Select **Log SnapCenter events to syslog**.

3. Select **Submit**.

    Once the storage is verified, the IP address of the storage system added is shown with the username entered.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/oracle-baremetal-snapcenter-add-production-storage-complete.png" alt-text="Screenshot showing the IP address of the storage system added.":::

    The default is one SVM per tenant. If a customer has multiple tenants, the recommendation is to configure all SVMs here in SnapCenter.

### Add secondary storage location

To add the disaster recovery (DR) storage location, the customer subscriptions in both the primary and DR locations must be peered. Contact Microsoft Operations for assistance.

Adding a secondary storage location is similar to adding the primary storage location. However, once the primary and DR locations are peered, access to the secondary storage location should be verified by pinging storage on the secondary location. 

>[!NOTE]
>If the ping is unsuccessful, it's usually because a default route doesn't exist on the host for the client virtual LAN (VLAN).

Once the ping is verified, repeat the steps you used for adding the primary storage, only now for the DR location on a DR host. We recommend using the same certificate in both locations, but it isn't required.

## Set up Oracle hosts

>[!NOTE]
>This process is for all Oracle hosts regardless of their location: production or disaster recovery.

1. Before adding the hosts to SnapCenter and installing the SnapCenter plugins, JAVA 1.8 must be installed. Verify that Java 1.8 is installed on each host before proceeding.

2. Create the same non-root user on each of the Oracle Real Application Clusters (RAC) hosts and add to /etc/sudoers. You will need to provide a new password.

3. Once the user has been created, it must be added to /etc/sudoers with an explicit set of permissions. These permissions are found by browsing to the following location on the SnapCenter VM: C:\ProgramData\NetApp\SnapCenter\Package Repository and opening the file oracle\_checksum.

4. Copy the appropriate set of commands, depending on the sudo package, where LINUXUSER is replaced with the newly created username. 

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/netapp-snapcenter-oracle-checksum-details.png" alt-text="Screenshot of the oracle_checksum file details.":::

    The set of commands for sudo package 1.8.7 or greater is copied into /etc/sudoers.

5. Once the user has been added to sudoers, in SnapCenter select **Settings** > **Credential** > **New**.

6. Fill out the Credential box as follows:

    - **Credential Name**: Provide a name that identifies username and sudoers.
    - **Authentication**: Linux
    - **Username**: Provide newly created username.
    - **Password**: <Enter Password>
    - Check **Use sudo privileges** box
    
7. Select **Ok**.

8. Select **Hosts** on the left navigation and then select **+ Add**.

9. Enter the following values for **Add Host**:

    - **Host Type**: Linux
    - **Host Name**: Enter either FQDN of the primary RAC host or the IP address of the primary RAC host.
    - **Credentials**: Select the drop-down and select the new created credentials for sudoers.
    - Check the **Oracle Database** box.

    >[!NOTE]
    >You must enter one of the actual Oracle Host IP addresses. Entering either a Node VIP or Scan IP is not supported.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-add-hosts-details.png" alt-text="Screenshot showing the details for the new host.":::
    
10. Select **More Options**. Ensure **Add all hosts in the Oracle RAC** is selected. Select **Save** and then select **Submit**.

11. The plugin installer will now attempt to communicate with the IP address provided. If communication is successful, the identity of the provided Oracle RAC host is confirmed by selecting **Confirm and Submit**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-add-hosts-confirm-fingerprint.png" alt-text="Screenshot showing the new host fingerprint.":::

12. After the initial Oracle RAC is confirmed, SnapCenter will then attempt to communicate and confirm all other Oracle RAC servers as part of the cluster. Select **Confirm Others and Submit**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-add-hosts-fingerprint-authentication.png" alt-text="Screenshot showing the authentication of fingerprint.":::

    A status screen appears for managed hosts letting you know that SnapCenter is installing the selected Oracle plugin. Installation progress can be checked by looking at the logs located at /opt/NetApp/snapcenter/scc/logs/DISCOVER-PLUGINS\_0.log on any of the Oracle RAC hosts. 

    Once the plugins are installed successfully, the following screen will appear.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-installed-plugins.png" alt-text="Screenshot showing all the installed SnapCenter plugins.":::

## Add credentials for Oracle Recovery Manager

The Oracle Recovery Manager (RMAN) catalog authentication method authenticates against the RMAN catalog database. If you have configured an external catalog mechanism and registered your database to catalog a database, you need to add RMAN catalog authentication. RMAN credentials can be added at any time.

1. In SnapCenter, select **Settings** on the left menu and then select **Credential**. Select **New** in the upper right corner.

2. Enter the **Credential Name** to call RMAN credentials stored in SnapCenter. In the **Authentication** drop-down, select **Oracle RMAN Catalog for Authentication**. Enter your username and password. Select **OK**.

3. Once the credentials are added, the database settings must be modified within SnapCenter. Select the database in resources. Select **Database Settings** in the upper right corner of the main window.

4. On the Database Settings screen, select **Configure Database**.

5. Expand **Configure RMAN Catalog Settings**. Select the dropdown for **Use Existing Credential** previously set for this database and select the appropriate option. Add the TNS Name for this individual database. Select **OK**.

    >[!NOTE]
    >Different credentials should be created in the preceding step for each unique combination of username and passwords. If you prefer, SnapCenter will accept a single set of credentials for all databases.
    >
    >Even though RMAN credentials have been added to the database, RMAN won't be cataloged unless the Catalog Backup with Oracle Recovery Manager (RMAN) is also checked for each protection policy, as discussed in the following section on creating protection policies (per your backup policies).

## Create protection policies

Once your hosts have been successfully added to SnapCenter, you're ready to create your protection policies. 

Select **Resources** on the left menu. SnapCenter will present all of the identified databases that existed on the RAC hosts. The Single Instance types for bn6p1X and grid are ignored as part of the protection scheme. The status of all should be "Not Protected" at this point.

As discussed in the [Overview](netapp-snapcenter-integration-oracle-baremetal.md#oracle-disaster-recovery-architecture), different file types have different snapshot frequencies that enable a local RPO of approximately 15 minutes by making archive log backups every 15 minutes. The datafiles are then backed up at longer intervals, like every hour or more. Therefore, two different policies are created.

With the RAC database(s) identified, several protection policies are created, including a policy for datafiles and control files and another for archive logs.

### Datafiles protection policy

Follow these steps to create a datafiles protection policy.

1. In SnapCenter, select **Settings** in the left menu and then select **Policies** on the top menu. Select **New**.

2. Select the radio button for **Datafiles and control files** and scroll down.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy.png" alt-text="Screenshot showing the details for the new database backup policy.":::

3. Select the radio button for **hourly**. If integration with RMAN is desired for catalog purposes and the RMAN credentials have already been added, select the checkbox for **Catalog backup with Oracle Recovery Manager (RMAN)**. Select **Next**. If the catalog backup is checked, [RMAN credentials must be added](#add-credentials-for-oracle-recovery-manager) for cataloging to occur.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-database-backup-policy-frequency.png" alt-text="Screenshot showing options to choose schedule frequency in your backup policy.":::

    >[!IMPORTANT]
    >A selection must be made for schedule policy even if a backup frequency other than hourly or daily, etc. is desired. The actual backup frequency is set later in the process. Do not select "none" unless all backups under this policy will be on-demand only.

4. Select **Retention** on the left menu. There are two types of retention settings that are set for a backup policy. The first retention setting is the maximum number of on-demand snapshots to be kept. Based on your backup policies, a set number of snapshots are kept, such as the following example of 48 on-demand snapshots kept for 14 days. Set the appropriate on-demand retention policy according to your backup policies.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/snapcenter-new-database-backup-policy-retention.png" alt-text="Screenshot showing the database backup policy retention setting.":::

5. The next retention setting set is the scheduled number of snapshots to keep based on the previous entry of either hourly, daily, weekly, etc. Select **Next**.

6. On the **Replication** screen, select the checkbox for **Update SnapMirror after creating a local snapshot copy** and select **Next**. The other entries are left at default.

    >[!NOTE]
    >SnapVault is not currently supported in the Oracle BareMetal Infrastructure environment.

    Replication can be added later by returning to the Protection Policy screen, selecting **modify protection policy** and **Replication** in the left menu.

7. The **Script** page is where you enter any scripts needed to run either before or after the Oracle backup takes place. Currently, scripts as part of the SnapCenter process aren't supported. Select **Next**.

8. Select **Verification** on the left menu. If you want the ability to verify snapshots for recoverability integrity, then select the checkbox next to hourly. No verification script commands are currently supported. Select **Next**.

    >[!NOTE]
    >The actual location and schedule of the verification process is added in a later section, Assign Protection Policies to Resources.

9. On the **Summary** page, verify all settings are entered as expected and select **Finish**.

### Archive logs protection policy

Follow the preceding steps again to create your archive logs protection policy. In step 2, select the radio button for **Archive logs** instead of "Datafiles and control files."

## Assign protection policies to resources

Once a policy has been created, it then needs to be associated with a resource in order for SnapCenter to start executing within that policy.

### Datafiles resource group

1. Select **Resources** in the left menu, and then select **New Resource Group** in the upper right corner of the main window.

2. Add the **Name** for this resource group and any tags for ease of searchability.

    >[!NOTE]
    >We recommend you check **Use custom name format for Snapshot copy** and add the following entries: **$ResourceGroup**, **$Policy**, and **$ScheduleType**. This ensures that the snapshot prefix meets the SnapCenter standard and that the snapshot name gives the necessary details at a glance. If you leave **Use custom name format for Snapshot copy** unchecked, whatever entry is placed in **Name** becomes the prefix for the snapshots created. Ensure that the name entered identifies the database and what is being protected, for instance, datafiles and control files. 

3. Under Backup settings, add **/u95** to exclude archive logs.

4. On the Resource page, move all databases that are protected by the same backup protection policy from "Available Resources" to "Selected Resources." Don't add the Oracle database instances for each host, just the databases. Select **Next**.

5. Select the protection policy for datafiles and control files you previously created. After selecting the policy, select the pencil under Configure schedules.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/new-datafiles-resource-group-available-policies.png" alt-text="Screenshot showing selecting the protection policy in order to configure schedules.":::

6. Add the schedule for the selected policy to execute. Ensure the start date is after the current date and time.

    >[!NOTE]
    >The scheduled frequency does not need to match the frequency selected when you created the policy. For hourly, we recommend you just leave "Repeat every 1 hours." The start time will serve as the start time each hour for backup to occur. Ensure that the schedule for protecting the datafiles does not overlap with the schedule for protecting the archive logs, as only one backup can be active at a given time.

7. Verification ensures the created snapshot is usable. The verification process is extensive, including creating clones of all Oracle database volumes, mounting the database to the primary host, and verifying its recoverability. This process is time-consuming and resource-consuming. If you want to configure the verification schedule, select the **+** sign.

    >[!NOTE]
    >The verification process occupies resources on the host for a significant amount of time. We recommended that if you add verification, do so on a host in the secondary location if available.
    
    The following screenshot shows verification of a new resource group that did not have replication enabled and snapshots replicated when it was created. 

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/new-resource-group-verification-schedules.png" alt-text="Screenshot showing how to configure the verification schedule for the resource group.":::

    If replication is enabled and a host in the disaster recovery location will be used for verification, then skip to step 2 in the following subsection. That step allows you to load secondary locators to verify backups on the secondary location.

### Add verification schedule for new resource group

1. Select either **Run verification after backup** or **Run scheduled verification** and select a pre-scheduled frequency in the drop-down. If DR is enabled, you can select **Verify on secondary storage location** to execute frequency in the DR location reducing resource strain on production. Select **OK**.

    :::image type="content" source="media/netapp-snapcenter-integration-oracle-baremetal/new-resource-group-add-verification-schedules.png" alt-text="Screenshot showing how to add a verification schedule.":::

    If verification isn't required or is already setup locally, then skip to SMTP setup (step 5) below.

2. If update SnapMirror was enabled when you created the datafiles protection policy, and a secondary storage location was added, SnapCenter detects replication between the two locations. In that case, a screen appears allowing you to load secondary locators to verify backups on the secondary location. Select **Load locators**.

3. After you select load locators, SnapCenter will present the SnapMirror relationships that it found containing the datafiles and control files. These should match the Disaster Recovery framework provided by Microsoft Operations. Select the pencil under Configure Schedules.

4. Select checkbox for **Verify on secondary storage location**. 

5. If an SMTP server is available, SnapCenter can send an email to SnapCenter administrators. Enter the following if you want an email sent.

    - **Email Preference**: Enter your preference for frequency of receiving email.
    - **From**: Enter the email address that SnapCenter will use to send email from.
    - **To**: Enter email address that SnapCenter will send email to.
    - **Subject**: Enter subject that SnapCenter will use when sending the email.
    - Select **Attach job report** checkbox.
    - Select **Next**.

6. Verify settings on the Summary page and select **Finish**.

Once a resource group has been created, to identify the resource group:

1. Select **Resources** on the left menu.
2. Select the dropdown menu in the main window next to View and select **Resource Group**.
 
    If this is your first Resource group, only the newly created resource group for datafiles and control files will be present. If you also created an archive log resource group, you'll see that as well.

### Archive log resource group

To assign protection policies to your archive log resource group, follow the same steps you followed when assigning protection policies to your Datafiles resource group. The only differences are:

- On step 3, don't add **/u95** to exclude archive logs; leave this field blank.
- On step 6, we recommend backing up archive logs every 15 minutes.
- The verification tab is blank for archive logs. 

## Next steps

Learn how to create an on-demand backup of your Oracle Database in SnapCenter:

> [!div class="nextstepaction"]
> [Create on-demand backup in SnapCenter](create-on-demand-backup-oracle-baremetal.md)
