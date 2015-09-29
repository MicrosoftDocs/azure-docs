<properties
	pageTitle="Azure AD Connect sync Configure filtering | Microsoft Azure"
	description="Explains how to configure filtering in Azure AD Connect sync."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/24/2015"
	ms.author="markusvi;andkjell"/>


# Azure AD Connect sync: Configure Filtering

In Azure AD Connect sync, you can enable filtering at any time. If you have already run the default configurations of directory synchronization and then configured the filtering, the objects that are filtered out are no longer synchronized to Azure AD. As a result of this, any objects in Azure AD that were previously synchronized but were then filtered are deleted in Azure AD. If objects were inadvertently deleted because of a filtering error, you can re-create the objects in Azure AD by removing your filtering configurations, and then synchronize your directories again.

> [AZURE.IMPORTANT]Microsoft does not support modification or operation of the Azure AD Connect sync outside of those actions formally documented. Any of these actions may result in an inconsistent or unsupported state of Azure AD Connect sync and as a result, Microsoft cannot provide technical support for such deployments.

With the exception of outbound attribute-based filtering, the configurations will be retained when you install or upgrade to a newer version of Azure AD Connect. It is always a best practice to verify that the configuration was not inadvertently changed after an upgrade to a newer version before running the first synchronization cycle.


## Filtering Options

> [AZURE.NOTE]In this topic, Source AD is used as name for your Active Directory Domain Service Connector. If you have multiple forests, you will have one Connector per forest and the configuration must be repeated for each forest.

The following three filtering configuration types can be applied to the Directory Synchronization tool:

- [**Domain-based**](#configure-domain-based filtering): You can use this filtering type to manage the properties of the SourceAD Connector in Azure AD Connect sync. This type enables you to select which domains are allowed to synchronize to Azure AD.

- [**Configure organizational-unit–based filtering**](#configure-organizational-unit–based filtering): You can use this filtering type to manage the properties of the SourceAD Connector in Azure AD Connect sync. This filtering type enables you to select which OUs are allowed to synchronize to Azure AD.

- [**Attribute–based**](#configure-attribute-based-filtering): You can use this filtering method to specify attribute-based filters. This enables you to control which objects should be synchronized to the cloud.

> [AZURE.NOTE]If you make a change to filter configuration and you use password synchronization then you need to trigger a full sync of all passwords after you have completed the configuration. For steps on how to trigger a password full sync see [Trigger a full sync of all passwords](active-directory-aadconnectsync-implement-password-synchronization.md#trigger-a-full-sync-of-all-passwords)

## Configure domain-based filtering

This section provides you with the steps you need to perform to configure your domain filter.

If you have added or removed domains in your forest after you have installed Azure AD Connect you will also have to update the filtering configuration.


### Changing the filter for existing domains

> [AZURE.NOTE] If you have modified your domain filter, you also need to update your run profiles.


**To set the domain filter, perform the following steps:**

1. Log on to the computer that is running Azure AD Connect sync by using an account that is a member of the **ADSyncAdmins** security group.

2. On **Start**, tap or click **Synchronization Service** to open the **Synchronization Service Manager**.

3. To open the connectors view, click **Connectors** in the **Tools** menu.

4. In the **Connectors** list, select the connector that has **Active Directory Domain Service** as **Type**.

5. To open the **Properties** dialog, click **Properties** in the **Actions** menu.

6. Click **Configure Directory Partitions**.

7. In the **Select directory partitions** list, verify that only the partitions you want to synchronize are selected. <br> To remove a domain from the synchronization process, clear the domain’s check box.

8. To close the **Properties** dialog, click **OK**.


If you have updated your domain filter, you also need to update the following run profiles:

- Full Import
- Full Synchronization
- Delta Import
- Delta Synchronization
- Export


If you have **removed** a partition from the directory partitions list, you need to make sure that all run profile steps that are referencing this partition are also removed.

**To remove a step from a run profile, perform the following steps:**

1. In the **Connectors** list, select the connector that has **Active Directory Domain Service** as **Type**.

2. To open the **Configure Run Profiles for** dialog, click **Configure Run Profiles** in the **Actions** menu.

3. In the **Connector run profiles** list, select the run profile you want to configure

4. For each step in the step details list, perform the following steps:

     4.1. If necessary, click the step to expand the step details.

     4.2. If the **Value** of the **Partition** attribute is a GUID, click Delete Step.

5. To close the **Configure Run Profiles for** dialog, click **OK**.

If you have **added** a partition to the directory partitions list, you need to make sure that a run profile step for that partition is available on each of the run profiles in the list above.

**To add a step to a run profile, perform the following steps:**

1. In the **Connectors** list, select the connector that has **Active Directory Domain Service** as **Type**.

2. To open the **Configure Run Profiles for** dialog, click **Configure Run Profiles** in the **Actions** menu.

3. In the **Connector run profiles** list, select the run profile you want to configure

4. To open the **Configure Run Profile** dialog, click **New Step**.

5. On the **Configure Step** page, in the step type list, select the step type, and then click **Next**.

6. On the **Connector Configuration** page, in the **Partition** list, select the name of the partition you have added to your domain filter.

7. To close the **Configure Run Profile** dialog, click **Finish**.

8. To close the **Configure Run Profiles** for dialog, click **OK**.

### Changing the filter for new or removed domains
If you have added a new domain to the forest or removed a domain from the forest, the domain filtering configuration must be updated.

**Steps if you have added a domain**

1. Log on to the computer that is running Azure AD Connect sync by using an account that is a member of the **ADSyncAdmins** security group.

2. On **Start**, tap or click **Synchronization Service** to open the **Synchronization Service Manager**.

3. To open the connectors view, click **Connectors** in the **Tools** menu.

4. In the **Connectors** list, select the connector that has **Active Directory Domain Service** as **Type**.

5. To open the **Properties** dialog, click **Properties** in the **Actions** menu.

6. Click **Configure Directory Partitions**.

7. Click the **Refresh** button at the top of the page.

8. In the **Select directory partitions** list, select the new domain.

9. To close the **Properties** dialog, click OK.

Make sure the same Connector is still selected. The run profiles for the Connector must now be configured.


- Full Import
- Full Synchronization
- Delta Import
- Delta Synchronization
- Export


10. To open the **Configure Run Profiles for** dialog, click **Configure Run Profiles** in the **Actions** menu.

11. In the **Connector run profiles** list, select the run profile you want to configure

12. To open the **Configure Run Profile** dialog, click **New Step**.

13. On the **Configure Step** page, in the step type list, select the step type, and then click **Next**.

14. On the **Connector Configuration** page, in the **Partition** list, select the name of the partition you have added to your domain filter.

15. To close the **Configure Run Profile** dialog, click **Finish**.

16. To close the **Configure Run Profiles** for dialog, click **OK**.

17. Repeat these steps for all run profiles.

**Steps if you have removed a domain**

1. Log on to the computer that is running Azure AD Connect sync by using an account that is a member of the **ADSyncAdmins** security group.

2. On **Start**, tap or click **Synchronization Service** to open the **Synchronization Service Manager**.

3. To open the connectors view, click **Connectors** in the **Tools** menu.

4. In the **Connectors** list, select the connector that has **Active Directory Domain Service** as **Type**.

5. To open the **Properties** dialog, click **Properties** in the **Actions** menu.

6. Click **Configure Directory Partitions**.

7. Click the **Refresh** button at the top of the page.

8. To close the **Properties** dialog, click OK. A message will pop-up saying a domain was removed and that configuration will be cleaned up.

## Configure organizational-unit–based filtering

**To configure organizational-unit–based filtering, perform the following steps:**

1. Log on to the computer that is running Azure AD Connect sync by using an account that is a member of the **ADSyncAdmins** security group.

2. On **Start**, tap or click **Synchronization Service** to open the **Synchronization Service Manager**.<br>

3. In the **Synchronization Service Manager**, click **Connectors**, and then double-click **SourceAD**.

4. Click **Configure Directory Partitions**, select the domain you want to configure, and then click **Containers**.

5. When prompted, enter your domain credentials for the on-premises Active Directory forest.<br> > [AZURE.NOTE]When presented with the credentials dialog box, the account used to import and export to AD DS will be displayed. If you do not know the password to the account you can enter another account to use. The account you use must have read permissions to the domain currently being configured.

6. In the **Select Containers** dialog box, clear the OUs that you don’t want to sync with the cloud directory, and then click **OK**.

7. Click **OK** on the **SourceAD Properties** page.

8. Run a full import and a delta sync by completing the following steps:

     8.1. In the connectors list, select **SourceAD**

     8.2. To open the **Run Connector** dialog, select **Run** from the **Actions** menu.

     8.3. In the **Run profiles** list, select **Full Import**, and then wait for the run profile to complete.

     8.4. To open the **Run Connector** dialog, select **Run** from the **Actions** menu.

     8.5. In the **Run profiles** list, select **Delta Synchronization**, and then wait for the run profile to complete.




## Configure attribute based filtering

There are several ways to configure filtering based on attributes. Configuration on inbound from AD is recommended since these configuration settings will be kept even after an upgrade to a newer version. Configuration on outbound to AAD is supported, but these settings will not be kept after an upgrade to a newer version and should only be used when it is required to look at the combined object in the metaverse to determine filtering.

### Inbound filtering

Inbound based filtering is leveraging the default configuration where objects going to AAD must have the metaverse attribute cloudFiltered not set to a value and the metaverse attribute sourceObjectType set to either “User” or “Contact”.

The attribute cloudFiltered should be set to True when the object should not be synchronized to Azure AD and kept empty in other cases. This method is used when we can look at an object and say that we do not want to synchronize an object (negative filtering).

In the following example, we will filter out all users where extensionAttribute15 has the value NoSync:

1. Log on to the computer that is running Azure AD Connect Sync by using an account that is a member of the ADSyncAdmins security group.
2. Open the **Synchronization Rules Editor** from the **Start Menu**.
3. Make sure **Inbound** is selected and click **Add New Rule**.
4. Give the rule a descriptive name, such as "*In from AD – User DoNotSyncFilter*", select the correct forest, **User** as the **CS object type**, and **Person** as the **MV object type**. As **Link Type**, select **Join** and in precedence type a value currently not used by another Synchronization Rule (e.g.: 50), and then click **Next**.
5. In **Scoping filter**, click **Add Group**, click **Add Clause** and in attribute select **ExtensionAttribute15**. Make sure the Operator is set to **EQUAL** and **type** in the value NoSync in the Value box. Click **Next**.
6. Leave the **Join** rules empty, and then click **Next**.
7. Click **Add Transformation**, select the **FlowType** to **Constant**, select the Target Attribute cloudFiltered and in the Source text box, type in True. Click Add to save the rule.
8. Perform a full sync: on the **Connectors** tab, right-click **SourceAD**, click **Run**, click **Full Synchronization**, and then click **OK**.


The attribute **sourceObjectType** will provision an **User** or **Contact** to Azure AD if this attribute has the value **User** or **Contact** respectively. By creating a Synchronization Rule with a higher precedence than those out of box, you can override the default behavior. This method also gives you an opportunity to express both positive and negative rules.

In the following example, you will only synchronize users when the department attribute is “*Sales*” or is empty:

1. Log on to the computer that is running Azure AD Connect Sync by using an account that is a member of the ADSyncAdmins security group.
2. Open the **Synchronization Rules Editor** from the **Start Menu**.
3. Make sure **Inbound** is selected, and then click **Add New Rule**.
4. Give the rule a descriptive name (e.g.: "*In from AD – User DoNotSyncFilter*"), select the correct forest, **User** as the **CS object type**, and **Person** as the **MV object type**. As **Link Type**, select **Join** and in **precedence type**, a value currently not used by another Synchronization Rule (e.g.: 60). Click **Next**.
5. Leave the **scoping filter** and **join rules** empty and click **Next** twice.
6. Click **Add Transformation**, select the **FlowType** to **Expression** and select the **Target Attribute** to **sourceObjectType**. In the **Source**, type in the following expression:<br>`IIF(IsNullOrEmpty([department]),NULL,IIF([department]<>”Sales”,”DoNotSync”,NULL))`
7. Click Add to save the rule.
8. Perform a full sync: on the **Connectors** tab, right-click **SourceAD**, click **Run**, click **Full Synchronization**, and then click **OK**. Here is a result how this would look like:<br>

> [AZURE.NOTE] Note that we are using a mix of cloudFiltered and sourceObjectType to determine which objects we want to synchronize to AAD.

With the use of expressions, you have very powerful filtering options. In the expression above, note that we provided the literal NULL when department is not present and when the department was Sales. This indicates that this attribute did not contribute a value and the out-of-box rules will be evaluated. We want this so they can determine if it is a **User** or **Contact** we should create in Azure AD.


## Outbound based filtering

In some cases it is necessary to do the filtering only after the objects have joined in the metaverse. It could for example be required to look at the mail attribute from the resource forest and the userPrincipalName attribute from the account forest to determine if an object should be synchronizedx. In these cases we will create the filtering on the outbound rule.

> [AZURE.NOTE] This method requires a change to the out-of-box Synchronization Rules. Changing the scope of a Synchronization Rule is supported, but the change might not be preserved after upgrading to a newer version of Azure AD Connect. If you use outbound based filtering, make a note of the changes to make and after an upgrade ensure the filtering is still there and reapply if required.


In this example, we will change the filtering so only users where both mail and userPrincipalName ends with @contoso.com will be synchronized:

1. Log on to the computer that is running Azure AD Connect Sync by using an account that is a member of the ADSyncAdmins security group.
2. Open Synchronization Rules Editor by finding it in the Start Menu.
3. Under Rule Types click on Outbound.
4. Find the rule named Out to AAD – User Join. Click Edit.
5. Click Scoping filter on the left hand navigation. Click Add clause and in Attribute select mail, in Operator select ENDSWITH, and in Value type @contoso.com. Click Add clause and in Attribiute select userPrincipalName, in Operator select ENDSWITH, and in Value type @contoso.com.
6. Click Save.
7. Perform a full sync: on the Connectors tab, right-click SourceAD, click Run, click Full Synchronization, and then click OK.


## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
