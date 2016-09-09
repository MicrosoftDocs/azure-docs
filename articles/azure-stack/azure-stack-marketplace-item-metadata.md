<properties
	pageTitle="Marketplace Item Metadata for Azure Stack | Microsoft Azure"
	description="Learn about the kinds of Marketplace Item metadata for Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="rupisure"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="rupisure"/>

# Marketplace item metadata for Azure Stack

Additional details for marketplace item text and icons are listed below.


## Identity information

| NAME      | REQUIRED | TYPE   | CONSTRAINTS                     | DESCRIPTION |
|-----------|----------|--------|---------------------------------|-------------|
| Name      | X        | string | [A-Za-z0-9]+                    |             |
| Publisher | X        | string | [A-Za-z0-9]+                    |             |
| Version   | X        | string | [SemVer v2](http://semver.org/) |             |

## Metadata

| NAME                 | REQUIRED | TYPE                                                                                                      | CONSTRAINTS                  | DESCRIPTION                                                              |
|----------------------|----------|-----------------------------------------------------------------------------------------------------------|------------------------------|--------------------------------------------------------------------------|
| DisplayName          | X        | string                                                                                                    | recommendation 80 characters | if longer than 80, Portal may not display your item name gracefully      |
| PublisherDisplayName | X        | string                                                                                                    | recommendation 30 characters | if longer than 30, Portal may not display your publisher name gracefully |
| PublisherLegalName   | X        | string                                                                                                    | max of 256 characters        |                                                                          |
| Summary              | X        | string                                                                                                    | 60 to 100 characters         |                                                                          |
| LongSummary          | X        | string                                                                                                    | 140 to 256 characters        | Not yet applicable in Azure Stack                                        |
| Description          | X        | [html](https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-metadata#html-sanitization) | 500 to 5000 characters       |                                                                          |

## Images

Below is the list of icons used in the marketplace.

| NAME          | WIDTH | HEIGHT | NOTES                             |
|---------------|-------|--------|-----------------------------------|
| Large         | 115px | 115px  | Always required.                  |
| Medium        | 90px  | 90px   | Always required.                  |
| Small         | 40px  | 40px   | Always required.                  |
| Screenshot(s) | 533px | 324px  | Optional.                         |

## Categories

Each marketplace item should be tagged with a category. This dictates which category the item appears in the portal UI. You can choose one of the existing categories in Azure Stack (Compute, Data + Storage, etc.) or choose a completely new one.

## Links

Each marketplace item can include a variety of links to additional content. The links are specified as a list of names and URIs.

| NAME        | REQUIRED | TYPE   | CONSTRAINTS          | DESCRIPTION |
|-------------|----------|--------|----------------------|-------------|
| DisplayName | X        | string | max of 64 characters |             |
| Uri         | X        | uri    |                      |             |

## Additional properties

In addition to the above metadata, marketplace authors can also provide custom key/value pair data in the following form.

| NAME        | REQUIRED | TYPE   | CONSTRAINTS          | DESCRIPTION |
|-------------|----------|--------|----------------------|-------------|
| DisplayName | X        | string | max of 25 characters |             |
| Value       | X        | string | max of 30 characters |             |

## HTML sanitization

For any field that allows HTML, the following elements and attributes are allowed.

"h1", "h2", "h3", "h4", "h5", "p", "ol", "ul", "li", "a[target|href]", "br", "strong", "em", "b", "i"

## Next steps

[The Azure Stack Marketplace](azure-stack-marketplace.md)

[Create a marketplace item](azure-stack-create-marketplace-item.md)

[Publish a marketplace item](azure-stack-publish-marketplace-item.md)

[Marketplace Item UI References](azure-stack-marketplace-item-ui-reference.md)
