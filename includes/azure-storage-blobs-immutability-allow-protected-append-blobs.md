---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 07/15/2022
 ms.author: normesta
---

Append blobs are comprised of blocks of data and optimized for data append operations required by auditing and logging scenarios. By design, append blobs only allow the addition of new blocks to the end of the blob. Regardless of immutability, modification or deletion of existing blocks in an append blob is fundamentally not allowed. To learn more about append blobs, see [About Append Blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-append-blobs).

The **AllowProtectedAppendWrites** property setting allows for writing new blocks to an append blob while maintaining immutability protection and compliance. If this setting is enabled, you can create an append blob directly in the policy-protected container and then continue to add new blocks of data to the end of the append blob with the Append Block operation. Only new blocks can be added; any existing blocks cannot be modified or deleted. Enabling this setting does not affect the immutability behavior of block blobs or page blobs. This property is available only for time-based retention policies.

The **AllowProtectedAppendWritesAll** property setting provides the same permissions as the **AllowProtectedAppendWrites** property but also enables the ability to write new blocks to a block blob. There is no public API that enables workloads and applications to append blocks to a block blob. This property setting was introduced as a means to support the way that certain Microsoft tools such as Azure Data Factory implement append blobs. By using this property, you can minimize errors that can appear when certain Microsoft tools used by your workloads attempt to append blocks. This property is available for both time-based retention and legal hold policies.