<properties
	pageTitle="What to do in the event of an Azure service disruption impacting Azure Key Vault | Microsoft Azure"
	description="Learn what to do in the event of an Azure service disruption impacting Azure Key Vault."
	services="key-vault"
	documentationCenter=""
	authors="adamglick"
	manager="danpl"
	editor=""/>

<tags
	ms.service="key-vault"
	ms.workload="key-vault"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/17/2016"
	ms.author="sumedhb;aglick"/>

#Azure Key Vault availability and redundancy

Azure Key Vault has multiple layers of redundancy built-in, to ensure your keys and secrets remain available to your application even when individual components of the service fail.

The contents of your key vault are replicated within region as well as to a secondary region at least 150 miles away within the same geography. This ensures very high durability of your keys and secrets.

If individual components within the Key Vault service fail, then alternate components within the region step in to serve your request. There is no degradation of functionality in this case. You do not need to take any action as this will happen automatically and transparent to you.

In the rare event that an entire Azure region is unavailable, the requests you make of the key vault in that region are automatically routed (“failed over”) to a secondary region. When the primary region is available again, requests are routed back (“failed back”) to the primary region. Again, you do not need to take any action as this will happen automatically. There are a few caveats you should be aware of:

  * in the event of a region fail-over, it may take a few minutes for the service to fail over. Requests made during this time may fail until the fail-over completes.

  * After a fail-over completes, your key vault is in ___read-only___ mode. The requests supported in this mode are:
    * list key vaults
    * get properties of key vaults
    * list secrets 
    * get secrets
    * list keys
    * get (properties of) keys
    * encrypt
    * decrypt
    * wrap
    * unwrap
    * verify
    * sign
    * backup

  * Once a failover is failed back, all request types (i.e. read ___and___ write requests) are available. 
