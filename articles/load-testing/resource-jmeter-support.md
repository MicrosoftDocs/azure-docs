---
title: Supported Apache JMeter features
titleSuffix: Azure Load Testing
description: Learn which Apache JMeter features are supported in Azure Load Testing. You can upload an existing JMeter script to create and run a load test.
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 06/14/2023
---

# Supported Apache JMeter features in Azure Load Testing

Azure Load Testing enables you to use an existing Apache JMeter script (JMX) to create and run a load test. This article explains which Apache JMeter features are supported in Azure Load Testing.

See the Azure Load Testing overview to learn [how Azure Load Testing works](./overview-what-is-azure-load-testing.md#how-does-azure-load-testing-work).

## Supported Apache JMeter version

Azure Load Testing uses Apache JMeter version 5.5 for running load tests.

## Apache JMeter support details

The following table lists the Apache JMeter features and their support in Azure Load Testing.

| Feature | Details | More information |
| ------- | ------- | ---------------- |
| Test plan elements | - Thread groups<br/>- Variables<br/>- Functions<br/>- Samplers<br/>- Logic controllers<br/>- Timers<br/>- Assertions<br/>- Preprocessors<br/>- Postprocessors | [Create a load test by using a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) |
| Samplers | All samplers and protocols are supported. | [Create a load test with a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) |
| Controllers | All logic controllers are supported, except for [Include controller](https://jmeter.apache.org/usermanual/component_reference.html#Include_Controller), [Module controller](https://jmeter.apache.org/usermanual/component_reference.html#Module_Controller), and [Recording controller](https://jmeter.apache.org/usermanual/component_reference.html#Recording_Controller). | [Create a load test with a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md) |
| Scripting | - BeanShell<br/>- JSR223 script | |
| Configuration elements | All configuration elements are supported.  | Example: [Read data from a CSV file](./how-to-read-csv-data.md) |
| JMeter properties | Azure Load Testing supports uploading a single user properties file per load test to override JMeter configuration settings or add custom properties.<br/>System properties files aren't supported. | [Configure JMeter user properties](./how-to-configure-user-properties.md) |
| Plugins | Azure Load Testing lets you use plugins from https://jmeter-plugins.org, or upload a Java archive (JAR) file with your own plugin code.| [Customize a load test with plugins](./how-to-use-jmeter-plugins.md) |
| Web Driver sampler | With a [Web Driver sampler](https://jmeter-plugins.org/wiki/WebDriverSampler/), due to the resource intensive nature of WebDriver tests, you can run tests with a load of up to four virtual users associated with the Web Driver sampler. You can have a higher load associated with other samplers, like HTTP sampler, in the same test. <br/> Tests with higher load associated with the Web Driver sampler can result in errors. In such a case, reduce the load and try again. | |
| Listeners | Azure Load Testing ignores all [Results Collectors](https://jmeter.apache.org/api/org/apache/jmeter/reporters/ResultCollector.html), which includes visualizers such as the [results tree](https://jmeter.apache.org/usermanual/component_reference.html#View_Results_Tree) or [graph results](https://jmeter.apache.org/usermanual/component_reference.html#Graph_Results). | |
| Dashboard report | The Azure Load Testing dashboard shows the client metrics, and optionally the server-side metrics. <br/>You can export the load test results to use them in a reporting tool or [generate the JMeter dashboard](https://jmeter.apache.org/usermanual/generating-dashboard.html#report) on your local machine.| [Export test results](./how-to-export-test-results.md) | 
| Test fragments| Not supported. | |

## Next steps

Start using Azure Load Testing:

- [Quickstart: Create a URL-based load test from the Azure portal](./quickstart-create-and-run-load-test.md)
- [Create a load test with a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md)
- [Quickstart: Add a load test to CI/CD](./quickstart-add-load-test-cicd.md)
