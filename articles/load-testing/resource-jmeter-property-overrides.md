---
title: JMeter property overrides by Azure Load Testing
description: 'The list of Apache JMeter properties that are overridden by Azure Load Testing. These properties are not available to redefine in your load test.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 01/12/2023
---

# JMeter property overrides by Azure Load Testing

Azure Load Testing enables you to specify JMeter configuration settings by [using a user properties file](./how-to-configure-user-properties.md). In this article, you learn which Apache JMeter properties Azure Load Testing already overrides. If you specify any of these properties in your load test, Azure Load Testing ignores your values.

## JMeter properties

This section lists the JMeter properties that Azure Load Testing overrides. Any value you specify for these properties is ignored by Azure Load Testing.

* mode
* sample_sender_strip_also_on_error
* asynch.batch.queue.size
* server.rmi.ssl.disable
* jmeterengine.nongui.maxport
* jmeterengine.nongui.port
* client.tries
* client.retries_delay
* client.rmi.localport
* server.rmi.localport
* server_port
* server.exitaftertest
* jmeterengine.stopfail.system.exit
* jmeterengine.remote.system.exit
* jmeterengine.force.system.exit
* jmeter.save.saveservice.output_format
* jmeter.save.saveservice.autoflush
* beanshell.server.file
* jmeter.save.saveservice.connect_time
* jpgc.repo.sendstats
* jmeter.save.saveservice.timestamp_format
* sampleresult.default.encoding
* user.classpath
* summariser.ignore_transaction_controller_sample_result

## Next steps

* Learn how to [Configure user properties in Azure Load Testing](./how-to-configure-user-properties.md).
