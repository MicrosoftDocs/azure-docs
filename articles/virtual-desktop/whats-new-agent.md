# What’s new in Azure Monitor for Windows Virtual Desktop?

This is a history of Azure Monitor for Windows Virtual Desktop releases and associated changes.

You can find your current version in the bottom right corner of your Insights page or configuration workbook. To access your workbook, go to [https://aka.ms/azmonwvdi](aka.ms/azmonwvdi).

## How to read version numbers

WVD Insights versioning complies with the following string format pattern: **General release: X.Y.Z** where X, Y, Z are non-negative integers without leading zeroes. Composition of the **X.Y.Z** version number string:

- **X**: major version; incremented for releases with breaking changes. Usually, non-preview versions start at 1.

- **Y**: minor version; incremented for backwards-compatible changes such as new features and deprecation notices.

- **Z**: patch version; incremented for changes that fix incorrect behavior or bugs.

Whenever a component is incremented, all subsequent components must be reset. One release has exactly one version number. One arbitrary version number tracks up to one release, or: not every possible version number will track a release. Version precedence: 0.0.1 \< 0.0.2 \< 0.1.0 \< 1.0.0 \< 1.0.0.210224 \< 1.0.999\< 1.0.1000.

## Version 1.0.0

Initial release date: March 21, 2021

- Introduced a new visual to capture high impact errors and warnings from the Windows Virtual Desktop agent event log at the top of the Host Diagnostics page

- Removed five expensive process performance counters from the default configuration. See our blog post for more information: [Updated guidance on Azure Monitor for WVD - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/updated-guidance-on-azure-monitor-for-wvd/m-p/2236173)

- Automated Windows Event Log set up in the configuration workbook

- Configuration workbook now supports automation for deploying the recommended Windows Event Logs

- Configuration workbook now supports installing the Log Analytics agent and setting preferred workspace for Session Hosts located outside of the Resource Group’s region.

- Introduced tabbed layout in the configuration workbook to clarify the setup process

- Introduced versioning
