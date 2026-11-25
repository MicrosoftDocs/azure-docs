---
title: Lifecycle management policy FAQ
titleSuffix: Azure Blob Storage
description: Frequently asked questions about lifecycle management policies in Azure Blob Storage.
ms.topic: faq
ms.service: azure-blob-storage
ms.date: 08/24/2026
ms.author: normesta
author: normesta
---

# Lifecycle management policy FAQ

This article answers frequently asked questions about lifecycle management policies in Azure Blob Storage.

## I created a new policy. Why don't the actions run immediately?

Once you configure a policy, it can take up to 24 hours for it to take effect. Once the policy is in effect, the time it takes for actions to run might vary depending on the size of the storage account and the operations performed.

## If I update an existing policy, how long does it take for the actions to run?

The updated policy can take up to 24 hours to take effect. Once the policy is in effect, the time that it takes for the actions to run varies depending on the size of the storage account and operations that are performed. If the update is to disable or delete a rule, and `enableAutoTierToHotFromCool` was used, auto-tiering to the hot tier still happens. For example, set a rule including `enableAutoTierToHotFromCool` based on last access. If the rule is disabled or deleted, and a blob is currently in the cool or cold tier and then accessed, it moves back to the hot tier as that is applied on access outside of lifecycle management. The blob doesn't move from hot to cool or cold if the lifecycle management rule is disabled or deleted. The only way to prevent `autoTierToHotFromCool` is to turn off last access time tracking.

## The run completes but doesn't move or delete some blobs

Depending on the size and the number of objects in a storage account, you might need more than one run to process all of the objects. You can also check the storage resource logs to see if the lifecycle management policy is performing the operations.

## I don't see capacity changes even though the policy is executing and deleting the blobs

Check if data protection features such as soft delete or versioning are enabled on the storage account. Even if the policy is deleting the blobs, those blobs might still exist in a soft deleted state or as an older version depending on how these features are configured.

## I rehydrated an archived blob. How do I prevent it from being moved back to the Archive tier temporarily?

If there's a lifecycle management policy in effect for the storage account, rehydrating a blob by changing its tier can result in a scenario where the lifecycle policy moves the blob back to the archive tier. This condition occurs if the last modified time, creation time, or last access time is beyond the threshold set for the policy. There are three ways to prevent this condition:

- Add the `daysAfterLastTierChangeGreaterThan` condition to the `tierToArchive` action of the policy. See [Use lifecycle management policies to archive blobs](archive-blob.md#use-lifecycle-management-policies-to-archive-blobs).

- Disable the rule that affects this blob temporarily to prevent it from being archived again. Re-enable the rule when the blob can be safely moved back to archive tier.

- If the blob needs to stay in the hot, cool, or cold tier permanently, copy the blob to another location where the lifecycle management policy isn't in effect.

## The blob prefix match string didn't apply the policy to the expected blobs

The blob prefix match field of a policy is a full or partial blob path, which you use to match the blobs you want the policy actions to apply to. The path must start with the container name. If you don't specify a prefix match, the policy applies to all the blobs in the storage account. The format of the prefix match string is `[container name]/[blob name]`.
Keep in mind the following points about the prefix match string:

- A prefix match string like `container1/` applies to all blobs in the container named `container1`. A prefix match string of `container1`, without the trailing forward slash character (`/`), applies to all blobs in all containers where the container name begins with the string `container1`. The prefix matches containers named `container11`, `container1234`, `container1ab`, and so on.
- A prefix match string of `container1/sub1/` applies to all blobs in the container named `container1` that begin with the string `sub1/`. For example, the prefix matches blobs named `container1/sub1/test.txt` or `container1/sub1/sub2/test.txt`.
- The asterisk character `*` is a valid character in a blob name. If you use the asterisk character in a prefix, the prefix matches blobs with an asterisk in their names. The asterisk doesn't function as a wildcard character.
- The question mark character `?` is a valid character in a blob name. If you use the question mark character in a prefix, the prefix matches blobs with a question mark in their names. The question mark doesn't function as a wildcard character.
- The prefix match considers only positive (`=`) logical comparisons. It ignores negative (`!=`) logical comparisons.
- The prefix matching operates in a case-sensitive manner.

## Is there a way to identify the time at which the policy will be executing?

Unfortunately, there's no way to track the time at which the policy will execute, as it's a background scheduling process. Lifecycle policies start execution within 24 hours of a rule being created or updated. Policies process objects continuously in the background, as required. The system gives priority to requests from workloads. So, there's no way to track the time at which a policy might be executing. The time required to process objects might depend on the request rate for the storage account. This time might be longer if the request rate for the storage account approaches the storage account limit.

## Next steps

- [Overview of lifecycle management policies](lifecycle-management-overview.md)
- [Configure a lifecycle management policy](lifecycle-management-policy-configure.md)
