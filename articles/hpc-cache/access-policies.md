---
title: Use access policies in Azure HPC Cache
description: How to create and apply custom access policies to limit client access to storage targets in Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 12/28/2020
ms.author: v-erkel
---

# Use client access policies

This article explains how to create and apply custom client access policies for your storage targets.

Client access policies control how clients are able to connect to the storage target exports. You can control things like root squash and read/write access at the client host or network level.

Access policies are applied to a namespace path, which means that you can use different access policies for two different exports on an NFS storage system.

This feature is for workflows where you need to control how different groups of clients access the storage targets.

If you don't need fine-grained control over storage target access, you can use the default policy, or you can customize the default policy with extra rules.

## Create a client access policy

Use the **Client access policies** page in the Azure portal to create and manage policies. <!-- is there AZ CLI for this? -->

[![screenshot of client access policies page. Several policies are defined, and some are expanded to show their rules](media/policies-overview.png)](media/policies-overview.png#lightbox)

Each policy is made up of rules. The rules are applied to hosts in order from the smallest scope (host) to the largest (default). The first rule that matches is applied and later rules are ignored.

To create a new access policy, click the **+ Add access policy** button at the top of the list. Give the new access policy a name, and enter at least one rule.

![screenshot of access policies edit blade with multiple rules filled in. Click ok to save the rule.](media/add-policy.png)

The rest of this section explains the values you can use in rules.

### Scope

The scope term and the address filter work together to define which clients are affected by the rule.

Use them to specify whether the rule applies to an individual client (host), a range of IP addresses (network), or all clients (default).

Select the appropriate **Scope** value for your rule:

* **Host** - The rule applies to an individual client
* **Network** - The rule applies to clients in a range of IP addresses
* **Default** - The rule applies to all clients.

Rules in a policy are evaluated in that order. After a client mount request matches one rule, the others are ignored.

### Address filter

The **Address filter** value specifies which clients match the rule.

If you set the scope to **host**, you can specify only one IP address in the filter. For the scope setting **default**, you can't enter any IP addresses in the **Address filter** field because the default scope matches all clients.

Specify the IP address or range of addresses for this rule. Use CIDR notation (example: 0.1.0.0/16) to specify an address range.

### Access level

Set what privileges to grant the clients that match the scope and filter.

Options are **read/write**, **read-only**, or **no access**.

### SUID

Check the **SUID** box to allow files in storage to set user IDs upon access.

SUID typically is used to increase a user’s privileges temporarily so that the user can accomplish a task related to that file.

### Submount access

Check this box to allow the specified clients to directly mount this export's subdirectories.

### Root squash

Choose whether or not to set root squash for clients that match this rule.

This value lets you allow root squash at the storage export level. You also can [set root squash at the cache level](configuration.md#configure-root-squash).

If you turn on root squash, you must also set the anonymous ID user value to one of these options:

* **-2** (nobody)
* **65534** (nobody)
* **-1** (no access)
* **65535** (no access)
* **0** (unprivileged root)

## Update access policies

You can edit or delete access policies from the table in the **Client access policies** page.

Click the policy name to open it for editing.

To delete a policy, mark the checkbox next to its name in the list, then click the **Delete** button at the top of the list. You can't delete the policy named "default".

> [!NOTE]
> You can't delete an access policy that is in use. Remove the policy from any namespace paths that include it before trying to delete it.

## Next steps

* Apply access policies in the namespace paths for your storage targets. Read [Set up the aggregated namespace](add-namespace-paths.md) to learn how.
