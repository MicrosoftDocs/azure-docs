





<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  <link rel="dns-prefetch" href="https://assets-cdn.github.com">
  <link rel="dns-prefetch" href="https://avatars0.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars1.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars2.githubusercontent.com">
  <link rel="dns-prefetch" href="https://avatars3.githubusercontent.com">
  <link rel="dns-prefetch" href="https://github-cloud.s3.amazonaws.com">
  <link rel="dns-prefetch" href="https://user-images.githubusercontent.com/">



  <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/frameworks-bedfc518345498ab3204d330c1727cde7e733526a09cd7df6867f6a231565091.css" integrity="sha256-vt/FGDRUmKsyBNMwwXJ83n5zNSagnNffaGf2ojFWUJE=" media="all" rel="stylesheet" />
  <link crossorigin="anonymous" href="https://assets-cdn.github.com/assets/github-e573184626eaab20e2f94261d3988b7b4e01cf474b05544601c1f4d78e91519e.css" integrity="sha256-5XMYRibqqyDi+UJh05iLe04Bz0dLBVRGAcH0146RUZ4=" media="all" rel="stylesheet" />
  
  
  
  

  <meta name="viewport" content="width=device-width">
  
  <title>Machine-Learning-Operationalization/aml-cli-reference.md at master · Azure/Machine-Learning-Operationalization</title>
  <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub">
  <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub">
  <meta property="fb:app_id" content="1401488693436528">

    
    <meta content="https://avatars0.githubusercontent.com/u/6844498?v=4&amp;s=400" property="og:image" /><meta content="GitHub" property="og:site_name" /><meta content="object" property="og:type" /><meta content="Azure/Machine-Learning-Operationalization" property="og:title" /><meta content="https://github.com/Azure/Machine-Learning-Operationalization" property="og:url" /><meta content="Machine-Learning-Operationalization - Deploying machine learning models to Azure" property="og:description" />

  <link rel="assets" href="https://assets-cdn.github.com/">
  <link rel="web-socket" href="wss://live.github.com/_sockets/VjI6MjAwNDgyMjU5OjRhNmI0ZWI2ZmJjNDNjOWM2MTlkOWQ0NDMwZDI1Yjc4MDczNWY1MWU0MmQ5ZTRmN2E3NWMyYTNkNzhkNjY0NmM=--0e8b8af20a2233fc7900ec93152dd9cf43ab62ea">
  <meta name="pjax-timeout" content="1000">
  <link rel="sudo-modal" href="/sessions/sudo_modal">
  <meta name="request-id" content="FA9E:28D9C:625EE1E:9967FFB:59B1D2A6" data-pjax-transient>
  

  <meta name="selected-link" value="repo_source" data-pjax-transient>

  <meta name="google-site-verification" content="KT5gs8h0wvaagLKAVWq8bbeNwnZZK1r1XQysX3xurLU">
<meta name="google-site-verification" content="ZzhVyEFwb7w3e0-uOTltm8Jsck2F5StVihD0exw2fsA">
    <meta name="google-analytics" content="UA-3769691-2">

<meta content="collector.githubapp.com" name="octolytics-host" /><meta content="github" name="octolytics-app-id" /><meta content="https://collector.githubapp.com/github-external/browser_event" name="octolytics-event-url" /><meta content="FA9E:28D9C:625EE1E:9967FFB:59B1D2A6" name="octolytics-dimension-request_id" /><meta content="sea" name="octolytics-dimension-region_edge" /><meta content="iad" name="octolytics-dimension-region_render" /><meta content="30939106" name="octolytics-actor-id" /><meta content="v-stbee" name="octolytics-actor-login" /><meta content="09f2a03134335e8f1ef4c4f66502ff92e9cb2e733372da83e1008bfee98ccae7" name="octolytics-actor-hash" />
<meta content="/&lt;user-name&gt;/&lt;repo-name&gt;/blob/show" data-pjax-transient="true" name="analytics-location" />




  <meta class="js-ga-set" name="dimension1" content="Logged In">


  

      <meta name="hostname" content="github.com">
  <meta name="user-login" content="v-stbee">

      <meta name="expected-hostname" content="github.com">
    <meta name="js-proxy-site-detection-payload" content="M2JlNWU5Mjk4NDQ2N2E3YjIyYzIwYWJlNDczOGMzMGM0ODAzY2Y3YmY2ODM3NDU3ZjhlZjBhYjhhOTAyMTdjYnx7InJlbW90ZV9hZGRyZXNzIjoiMTMxLjEwNy4xNjAuNzEiLCJyZXF1ZXN0X2lkIjoiRkE5RToyOEQ5Qzo2MjVFRTFFOjk5NjdGRkI6NTlCMUQyQTYiLCJ0aW1lc3RhbXAiOjE1MDQ4MjYwMjIsImhvc3QiOiJnaXRodWIuY29tIn0=">

    <meta name="enabled-features" content="UNIVERSE_BANNER">

  <meta name="html-safe-nonce" content="7609ca73f89d015621e0aa0f1b0fb7cb1b3c0242">

  <meta http-equiv="x-pjax-version" content="1685561c1a58a252bb3172eb6e909b0c">
  

      <link href="https://github.com/Azure/Machine-Learning-Operationalization/commits/master.atom" rel="alternate" title="Recent Commits to Machine-Learning-Operationalization:master" type="application/atom+xml">

  <meta name="description" content="Machine-Learning-Operationalization - Deploying machine learning models to Azure">
  <meta name="go-import" content="github.com/Azure/Machine-Learning-Operationalization git https://github.com/Azure/Machine-Learning-Operationalization.git">

  <meta content="6844498" name="octolytics-dimension-user_id" /><meta content="Azure" name="octolytics-dimension-user_login" /><meta content="87853437" name="octolytics-dimension-repository_id" /><meta content="Azure/Machine-Learning-Operationalization" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="87853437" name="octolytics-dimension-repository_network_root_id" /><meta content="Azure/Machine-Learning-Operationalization" name="octolytics-dimension-repository_network_root_nwo" /><meta content="false" name="octolytics-dimension-repository_explore_github_marketplace_ci_cta_shown" />


    <link rel="canonical" href="https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/aml-cli-reference.md" data-pjax-transient>


  <meta name="browser-stats-url" content="https://api.github.com/_private/browser/stats">

  <meta name="browser-errors-url" content="https://api.github.com/_private/browser/errors">

  <link rel="mask-icon" href="https://assets-cdn.github.com/pinned-octocat.svg" color="#000000">
  <link rel="icon" type="image/x-icon" href="https://assets-cdn.github.com/favicon.ico">

<meta name="theme-color" content="#1e2327">


  <meta name="u2f-support" content="true">

  </head>

  <body class="logged-in env-production page-blob">
    

  <div class="position-relative js-header-wrapper ">
    <a href="#start-of-content" tabindex="1" class="bg-black text-white p-3 show-on-focus js-skip-to-content">Skip to content</a>
    <div id="js-pjax-loader-bar" class="pjax-loader-bar"><div class="progress"></div></div>

    
    
    



        
<header class="Header  f5" role="banner">
  <div class="d-flex px-3 flex-justify-between container-lg">
    <div class="d-flex flex-justify-between">
      <a class="header-logo-invertocat" href="https://github.com/" data-hotkey="g d" aria-label="Homepage" data-ga-click="Header, go to dashboard, icon:logo">
  <svg aria-hidden="true" class="octicon octicon-mark-github" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
</a>


    </div>

    <div class="HeaderMenu d-flex flex-justify-between flex-auto">
      <div class="d-flex">
            <div class="">
              <div class="header-search scoped-search site-scoped-search js-site-search" role="search">
  <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/Azure/Machine-Learning-Operationalization/search" class="js-site-search-form" data-scoped-search-url="/Azure/Machine-Learning-Operationalization/search" data-unscoped-search-url="/search" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
    <label class="form-control header-search-wrapper js-chromeless-input-container">
        <a href="/Azure/Machine-Learning-Operationalization/blob/master/documentation/aml-cli-reference.md" class="header-search-scope no-underline">This repository</a>
      <input type="text"
        class="form-control header-search-input js-site-search-focus js-site-search-field is-clearable"
        data-hotkey="s"
        name="q"
        value=""
        placeholder="Search"
        aria-label="Search this repository"
        data-unscoped-placeholder="Search GitHub"
        data-scoped-placeholder="Search"
        autocapitalize="off">
        <input type="hidden" class="js-site-search-type-field" name="type" >
    </label>
</form></div>

            </div>

          <ul class="d-flex pl-2 flex-items-center text-bold list-style-none" role="navigation">
            <li>
              <a href="/pulls" aria-label="Pull requests you created" class="js-selected-navigation-item HeaderNavlink px-2" data-ga-click="Header, click, Nav menu - item:pulls context:user" data-hotkey="g p" data-selected-links="/pulls /pulls/assigned /pulls/mentioned /pulls">
                Pull requests
</a>            </li>
            <li>
              <a href="/issues" aria-label="Issues you created" class="js-selected-navigation-item HeaderNavlink px-2" data-ga-click="Header, click, Nav menu - item:issues context:user" data-hotkey="g i" data-selected-links="/issues /issues/assigned /issues/mentioned /issues">
                Issues
</a>            </li>
                <li>
                  <a href="/marketplace" class="js-selected-navigation-item HeaderNavlink px-2" data-ga-click="Header, click, Nav menu - item:marketplace context:user" data-selected-links=" /marketplace">
                    Marketplace
</a>                </li>
            <li>
              <a href="/explore" class="js-selected-navigation-item HeaderNavlink px-2" data-ga-click="Header, click, Nav menu - item:explore" data-selected-links="/explore /trending /trending/developers /integrations /integrations/feature/code /integrations/feature/collaborate /integrations/feature/ship showcases showcases_search showcases_landing /explore">
                Explore
</a>            </li>
          </ul>
      </div>

      <div class="d-flex">
        
<ul class="user-nav d-flex flex-items-center list-style-none" id="user-links">
  <li class="dropdown js-menu-container js-header-notifications">
    <span class="d-inline-block  px-2">
      

    </span>
  </li>

  <li class="dropdown js-menu-container">
    <a class="HeaderNavlink tooltipped tooltipped-s js-menu-target d-flex px-2 flex-items-center" href="/new"
       aria-label="Create new…"
       aria-expanded="false"
       aria-haspopup="true"
       data-ga-click="Header, create new, icon:add">
      <svg aria-hidden="true" class="octicon octicon-plus float-left" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5z"/></svg>
      <span class="dropdown-caret mt-1"></span>
    </a>

    <div class="dropdown-menu-content js-menu-content">
      <ul class="dropdown-menu dropdown-menu-sw">
        
<a class="dropdown-item" href="/new" data-ga-click="Header, create new repository">
  New repository
</a>

  <a class="dropdown-item" href="/new/import" data-ga-click="Header, import a repository">
    Import repository
  </a>

<a class="dropdown-item" href="https://gist.github.com/" data-ga-click="Header, create new gist">
  New gist
</a>

  <a class="dropdown-item" href="/organizations/new" data-ga-click="Header, create new organization">
    New organization
  </a>



  <div class="dropdown-divider"></div>
  <div class="dropdown-header">
    <span title="Azure/Machine-Learning-Operationalization">This repository</span>
  </div>
    <a class="dropdown-item" href="/Azure/Machine-Learning-Operationalization/issues/new" data-ga-click="Header, create new issue">
      New issue
    </a>

      </ul>
    </div>
  </li>

  <li class="dropdown js-menu-container">

    <details class="dropdown-details d-flex pl-2 flex-items-center">
      <summary class="HeaderNavlink name"
        aria-label="View profile and more"
        data-ga-click="Header, show menu, icon:avatar">
        <img alt="@v-stbee" class="avatar" src="https://avatars2.githubusercontent.com/u/30939106?v=4&amp;s=40" height="20" width="20">
        <span class="dropdown-caret"></span>
      </summary>

      <ul class="dropdown-menu dropdown-menu-sw">
        <li class="dropdown-header header-nav-current-user css-truncate">
          Signed in as <strong class="css-truncate-target">v-stbee</strong>
        </li>

        <li class="dropdown-divider"></li>

        <li><a class="dropdown-item" href="/v-stbee" data-ga-click="Header, go to profile, text:your profile">
          Your profile
        </a></li>
        <li><a class="dropdown-item" href="/v-stbee?tab=stars" data-ga-click="Header, go to starred repos, text:your stars">
          Your stars
        </a></li>
          <li><a class="dropdown-item" href="https://gist.github.com/" data-ga-click="Header, your gists, text:your gists">Your Gists</a></li>

        <li class="dropdown-divider"></li>

        <li><a class="dropdown-item" href="https://help.github.com" data-ga-click="Header, go to help, text:help">
          Help
        </a></li>

        <li><a class="dropdown-item" href="/settings/profile" data-ga-click="Header, go to settings, icon:settings">
          Settings
        </a></li>

        <li><!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/logout" class="logout-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="mV9mLFQHeAH5L8NsbL7T8fmO7ZEDSBij9q51EsKNJ4oXlnpsg9DdbWjLnfDjvB65GRkt+ZwUfpnzztj14M06ig==" /></div>
          <button type="submit" class="dropdown-item dropdown-signout" data-ga-click="Header, sign out, icon:logout">
            Sign out
          </button>
        </form></li>
      </ul>
    </details>
  </li>
</ul>


        <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/logout" class="sr-only right-0" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="t6IWY2Yu3oEnOJjX0wGx2V7IW3aviWfdEdGkY8bIx1A5awojsfl77bbcxktcA3yRvl+bHjDVAecUsQmE5IjaUA==" /></div>
          <button type="submit" class="dropdown-item dropdown-signout" data-ga-click="Header, sign out, icon:logout">
            Sign out
          </button>
</form>      </div>
    </div>
  </div>
</header>


      

  </div>

  <div id="start-of-content" class="show-on-focus"></div>

    <div id="js-flash-container">
</div>



  <div role="main">
        <div itemscope itemtype="http://schema.org/SoftwareSourceCode">
    <div id="js-repo-pjax-container" data-pjax-container>
      



  



    <div class="pagehead repohead instapaper_ignore readability-menu experiment-repo-nav">
      <div class="container repohead-details-container">

        <ul class="pagehead-actions">
  <li>
        <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="3eUMmMvukhzVUayJx6HQeyPM8uvQ/MIJxVhKSx6K0JcN4f8mPJuXayf3oBkiajQ9seVye6vJly83esVBE7PgDQ==" /></div>      <input class="form-control" id="repository_id" name="repository_id" type="hidden" value="87853437" />

        <div class="select-menu js-menu-container js-select-menu">
          <a href="/Azure/Machine-Learning-Operationalization/subscription"
            class="btn btn-sm btn-with-count select-menu-button js-menu-target"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
            aria-label="Toggle repository notifications menu"
            data-ga-click="Repository, click Watch settings, action:blob#show">
            <span class="js-select-button">
                <svg aria-hidden="true" class="octicon octicon-eye" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"/></svg>
                Watch
            </span>
          </a>
            <a class="social-count js-social-count"
              href="/Azure/Machine-Learning-Operationalization/watchers"
              aria-label="27 users are watching this repository">
              27
            </a>

        <div class="select-menu-modal-holder">
          <div class="select-menu-modal subscription-menu-modal js-menu-content">
            <div class="select-menu-header js-navigation-enable" tabindex="-1">
              <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"/></svg>
              <span class="select-menu-title">Notifications</span>
            </div>

              <div class="select-menu-list js-navigation-container" role="menu">

                <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
                  <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
                  <div class="select-menu-item-text">
                    <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                    <span class="select-menu-item-heading">Not watching</span>
                    <span class="description">Be notified when participating or @mentioned.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <svg aria-hidden="true" class="octicon octicon-eye" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"/></svg>
                      Watch
                    </span>
                  </div>
                </div>

                <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                  <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
                  <div class="select-menu-item-text">
                    <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                    <span class="select-menu-item-heading">Watching</span>
                    <span class="description">Be notified of all conversations.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <svg aria-hidden="true" class="octicon octicon-eye" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6C13 14 16 8 16 8s-3-6-7.94-6zM8 12c-2.2 0-4-1.78-4-4 0-2.2 1.8-4 4-4 2.22 0 4 1.8 4 4 0 2.22-1.78 4-4 4zm2-4c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"/></svg>
                        Unwatch
                    </span>
                  </div>
                </div>

                <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
                  <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
                  <div class="select-menu-item-text">
                    <input id="do_ignore" name="do" type="radio" value="ignore" />
                    <span class="select-menu-item-heading">Ignoring</span>
                    <span class="description">Never be notified.</span>
                    <span class="js-select-button-text hidden-select-button-text">
                      <svg aria-hidden="true" class="octicon octicon-mute" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8 2.81v10.38c0 .67-.81 1-1.28.53L3 10H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h2l3.72-3.72C7.19 1.81 8 2.14 8 2.81zm7.53 3.22l-1.06-1.06-1.97 1.97-1.97-1.97-1.06 1.06L11.44 8 9.47 9.97l1.06 1.06 1.97-1.97 1.97 1.97 1.06-1.06L13.56 8l1.97-1.97z"/></svg>
                        Stop ignoring
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
</form>
  </li>

  <li>
    
  <div class="js-toggler-container js-social-container starring-container ">
    <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/Azure/Machine-Learning-Operationalization/unstar" class="starred" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="2YnTxlmp3Cft3kbiKxTokradB6vbGTr8m6KYnxkaMC7h6KT+WgNqmtSsHmSZRegeYTELcSX2wT+cKXL4daiskA==" /></div>
      <button
        type="submit"
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Unstar this repository" title="Unstar Azure/Machine-Learning-Operationalization"
        data-ga-click="Repository, click unstar button, action:blob#show; text:Unstar">
        <svg aria-hidden="true" class="octicon octicon-star" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"/></svg>
        Unstar
      </button>
        <a class="social-count js-social-count" href="/Azure/Machine-Learning-Operationalization/stargazers"
           aria-label="36 users starred this repository">
          36
        </a>
</form>
    <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/Azure/Machine-Learning-Operationalization/star" class="unstarred" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="e2Fp5TxBFaHvI/IdHNGFEj7qwz9DfIwrxvcGnNDce5jVMnFHHz4zAeObh8QoN+duULgSExX4Hi8oSlkys00W+w==" /></div>
      <button
        type="submit"
        class="btn btn-sm btn-with-count js-toggler-target"
        aria-label="Star this repository" title="Star Azure/Machine-Learning-Operationalization"
        data-ga-click="Repository, click star button, action:blob#show; text:Star">
        <svg aria-hidden="true" class="octicon octicon-star" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"/></svg>
        Star
      </button>
        <a class="social-count js-social-count" href="/Azure/Machine-Learning-Operationalization/stargazers"
           aria-label="36 users starred this repository">
          36
        </a>
</form>  </div>

  </li>

  <li>
          <a href="#fork-destination-box" class="btn btn-sm btn-with-count"
              title="Fork your own copy of Azure/Machine-Learning-Operationalization to your account"
              aria-label="Fork your own copy of Azure/Machine-Learning-Operationalization to your account"
              rel="facebox"
              data-ga-click="Repository, show fork modal, action:blob#show; text:Fork">
              <svg aria-hidden="true" class="octicon octicon-repo-forked" height="16" version="1.1" viewBox="0 0 10 16" width="10"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>
            Fork
          </a>

          <div id="fork-destination-box" style="display: none;">
            <h2 class="facebox-header" data-facebox-id="facebox-header">Where should we fork this repository?</h2>
            <include-fragment src=""
                class="js-fork-select-fragment fork-select-fragment"
                data-url="/Azure/Machine-Learning-Operationalization/fork?fragment=1">
              <img alt="Loading" height="64" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif" width="64" />
            </include-fragment>
          </div>

    <a href="/Azure/Machine-Learning-Operationalization/network" class="social-count"
       aria-label="27 users forked this repository">
      27
    </a>
  </li>
</ul>

        <h1 class="public ">
  <svg aria-hidden="true" class="octicon octicon-repo" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"/></svg>
  <span class="author" itemprop="author"><a href="/Azure" class="url fn" rel="author">Azure</a></span><!--
--><span class="path-divider">/</span><!--
--><strong itemprop="name"><a href="/Azure/Machine-Learning-Operationalization" data-pjax="#js-repo-pjax-container">Machine-Learning-Operationalization</a></strong>

</h1>

      </div>
      <div class="container">
        
<nav class="reponav js-repo-nav js-sidenav-container-pjax"
     itemscope
     itemtype="http://schema.org/BreadcrumbList"
     role="navigation"
     data-pjax="#js-repo-pjax-container">

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a href="/Azure/Machine-Learning-Operationalization" class="js-selected-navigation-item selected reponav-item" data-hotkey="g c" data-selected-links="repo_source repo_downloads repo_commits repo_releases repo_tags repo_branches /Azure/Machine-Learning-Operationalization" itemprop="url">
      <svg aria-hidden="true" class="octicon octicon-code" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M9.5 3L8 4.5 11.5 8 8 11.5 9.5 13 14 8 9.5 3zm-5 0L0 8l4.5 5L6 11.5 2.5 8 6 4.5 4.5 3z"/></svg>
      <span itemprop="name">Code</span>
      <meta itemprop="position" content="1">
</a>  </span>

    <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
      <a href="/Azure/Machine-Learning-Operationalization/issues" class="js-selected-navigation-item reponav-item" data-hotkey="g i" data-selected-links="repo_issues repo_labels repo_milestones /Azure/Machine-Learning-Operationalization/issues" itemprop="url">
        <svg aria-hidden="true" class="octicon octicon-issue-opened" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"/></svg>
        <span itemprop="name">Issues</span>
        <span class="Counter">8</span>
        <meta itemprop="position" content="2">
</a>    </span>

  <span itemscope itemtype="http://schema.org/ListItem" itemprop="itemListElement">
    <a href="/Azure/Machine-Learning-Operationalization/pulls" class="js-selected-navigation-item reponav-item" data-hotkey="g p" data-selected-links="repo_pulls /Azure/Machine-Learning-Operationalization/pulls" itemprop="url">
      <svg aria-hidden="true" class="octicon octicon-git-pull-request" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"/></svg>
      <span itemprop="name">Pull requests</span>
      <span class="Counter">4</span>
      <meta itemprop="position" content="3">
</a>  </span>

    <a href="/Azure/Machine-Learning-Operationalization/projects" class="js-selected-navigation-item reponav-item" data-selected-links="repo_projects new_repo_project repo_project /Azure/Machine-Learning-Operationalization/projects">
      <svg aria-hidden="true" class="octicon octicon-project" height="16" version="1.1" viewBox="0 0 15 16" width="15"><path fill-rule="evenodd" d="M10 12h3V2h-3v10zm-4-2h3V2H6v8zm-4 4h3V2H2v12zm-1 1h13V1H1v14zM14 0H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"/></svg>
      Projects
      <span class="Counter" >0</span>
</a>
    <a href="/Azure/Machine-Learning-Operationalization/wiki" class="js-selected-navigation-item reponav-item" data-hotkey="g w" data-selected-links="repo_wiki /Azure/Machine-Learning-Operationalization/wiki">
      <svg aria-hidden="true" class="octicon octicon-book" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M3 5h4v1H3V5zm0 3h4V7H3v1zm0 2h4V9H3v1zm11-5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm2-6v9c0 .55-.45 1-1 1H9.5l-1 1-1-1H2c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h5.5l1 1 1-1H15c.55 0 1 .45 1 1zm-8 .5L7.5 3H2v9h6V3.5zm7-.5H9.5l-.5.5V12h6V3z"/></svg>
      Wiki
</a>

    <div class="reponav-dropdown js-menu-container">
      <button type="button" class="btn-link reponav-item reponav-dropdown js-menu-target " data-no-toggle aria-expanded="false" aria-haspopup="true">
        Insights
        <svg aria-hidden="true" class="octicon octicon-triangle-down v-align-middle text-gray" height="11" version="1.1" viewBox="0 0 12 16" width="8"><path fill-rule="evenodd" d="M0 5l6 6 6-6z"/></svg>
      </button>
      <div class="dropdown-menu-content js-menu-content">
        <div class="dropdown-menu dropdown-menu-sw">
          <a class="dropdown-item" href="/Azure/Machine-Learning-Operationalization/pulse" data-skip-pjax>
            <svg aria-hidden="true" class="octicon octicon-pulse" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M11.5 8L8.8 5.4 6.6 8.5 5.5 1.6 2.38 8H0v2h3.6l.9-1.8.9 5.4L9 8.5l1.6 1.5H14V8z"/></svg>
            Pulse
          </a>
          <a class="dropdown-item" href="/Azure/Machine-Learning-Operationalization/graphs" data-skip-pjax>
            <svg aria-hidden="true" class="octicon octicon-graph" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"/></svg>
            Graphs
          </a>
        </div>
      </div>
    </div>
</nav>

      </div>
    </div>

<div class="container new-discussion-timeline experiment-repo-nav">
  <div class="repository-content">

    
  <a href="/Azure/Machine-Learning-Operationalization/blob/0532db1931410222727f99784e5c3a90dbbb075c/documentation/aml-cli-reference.md" class="d-none js-permalink-shortcut" data-hotkey="y">Permalink</a>

  <!-- blob contrib key: blob_contributors:v21:827b1e29718945fd3ed52b00de9c786c -->

  <div class="file-navigation js-zeroclipboard-container">
    
<div class="select-menu branch-select-menu js-menu-container js-select-menu float-left">
  <button class=" btn btn-sm select-menu-button js-menu-target css-truncate" data-hotkey="w"
    
    type="button" aria-label="Switch branches or tags" aria-expanded="false" aria-haspopup="true">
      <i>Branch:</i>
      <span class="js-select-button css-truncate-target">master</span>
  </button>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax>

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <svg aria-label="Close" class="octicon octicon-x js-menu-close" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"/></svg>
        <span class="select-menu-title">Switch branches/tags</span>
      </div>

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="form-control js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" data-filter-placeholder="Filter branches/tags" class="js-select-menu-tab" role="tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" data-filter-placeholder="Find a tag…" class="js-select-menu-tab" role="tab">Tags</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches" role="menu">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/batch_sample_update/documentation/aml-cli-reference.md"
               data-name="batch_sample_update"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                batch_sample_update
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/donsworkingbranch/documentation/aml-cli-reference.md"
               data-name="donsworkingbranch"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                donsworkingbranch
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/generate_schema_docs/documentation/aml-cli-reference.md"
               data-name="generate_schema_docs"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                generate_schema_docs
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/magic/documentation/aml-cli-reference.md"
               data-name="magic"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                magic
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open selected"
               href="/Azure/Machine-Learning-Operationalization/blob/master/documentation/aml-cli-reference.md"
               data-name="master"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                master
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/script_fix/documentation/aml-cli-reference.md"
               data-name="script_fix"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                script_fix
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/script/documentation/aml-cli-reference.md"
               data-name="script"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                script
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/update_script/documentation/aml-cli-reference.md"
               data-name="update_script"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                update_script
              </span>
            </a>
            <a class="select-menu-item js-navigation-item js-navigation-open "
               href="/Azure/Machine-Learning-Operationalization/blob/use_sdk/documentation/aml-cli-reference.md"
               data-name="use_sdk"
               data-skip-pjax="true"
               rel="nofollow">
              <svg aria-hidden="true" class="octicon octicon-check select-menu-item-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5z"/></svg>
              <span class="select-menu-item-text css-truncate-target js-select-menu-filter-text">
                use_sdk
              </span>
            </a>
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div>

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div>

    </div>
  </div>
</div>

    <div class="BtnGroup float-right">
      <a href="/Azure/Machine-Learning-Operationalization/find/master"
            class="js-pjax-capture-input btn btn-sm BtnGroup-item"
            data-pjax
            data-hotkey="t">
        Find file
      </a>
      <button aria-label="Copy file path to clipboard" class="js-zeroclipboard btn btn-sm BtnGroup-item tooltipped tooltipped-s" data-copied-hint="Copied!" type="button">Copy path</button>
    </div>
    <div class="breadcrumb js-zeroclipboard-target">
      <span class="repo-root js-repo-root"><span class="js-path-segment"><a href="/Azure/Machine-Learning-Operationalization"><span>Machine-Learning-Operationalization</span></a></span></span><span class="separator">/</span><span class="js-path-segment"><a href="/Azure/Machine-Learning-Operationalization/tree/master/documentation"><span>documentation</span></a></span><span class="separator">/</span><strong class="final-path">aml-cli-reference.md</strong>
    </div>
  </div>


  
  <div class="commit-tease">
      <span class="float-right">
        <a class="commit-tease-sha" href="/Azure/Machine-Learning-Operationalization/commit/c94d5b3b955d384d0fc1530b612a8d873f7d4bec" data-pjax>
          c94d5b3
        </a>
        <relative-time datetime="2017-09-07T19:25:33Z">Sep 7, 2017</relative-time>
      </span>
      <div>
        <img alt="@v-stbee" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/30939106?v=4&amp;s=40" width="20" />
        <a href="/v-stbee" class="user-mention" rel="contributor">v-stbee</a>
          <a href="/Azure/Machine-Learning-Operationalization/commit/c94d5b3b955d384d0fc1530b612a8d873f7d4bec" class="message" data-pjax="true" title="Update aml-cli-reference.md

First pass to add important elements to the documentation.">Update aml-cli-reference.md</a>
      </div>

    <div class="commit-tease-contributors">
      <button type="button" class="btn-link muted-link contributors-toggle" data-facebox="#blob_contributors_box">
        <strong>3</strong>
         contributors
      </button>
          <a class="avatar-link tooltipped tooltipped-s" aria-label="raymondlaghaeian" href="/Azure/Machine-Learning-Operationalization/commits/master/documentation/aml-cli-reference.md?author=raymondlaghaeian"><img alt="@raymondlaghaeian" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/4458685?v=4&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="v-stbee" href="/Azure/Machine-Learning-Operationalization/commits/master/documentation/aml-cli-reference.md?author=v-stbee"><img alt="@v-stbee" class="avatar" height="20" src="https://avatars2.githubusercontent.com/u/30939106?v=4&amp;s=40" width="20" /> </a>
    <a class="avatar-link tooltipped tooltipped-s" aria-label="vDonGlover" href="/Azure/Machine-Learning-Operationalization/commits/master/documentation/aml-cli-reference.md?author=vDonGlover"><img alt="@vDonGlover" class="avatar" height="20" src="https://avatars1.githubusercontent.com/u/17439056?v=4&amp;s=40" width="20" /> </a>


    </div>

    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header" data-facebox-id="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list" data-facebox-id="facebox-description">
          <li class="facebox-user-list-item">
            <img alt="@raymondlaghaeian" height="24" src="https://avatars0.githubusercontent.com/u/4458685?v=4&amp;s=48" width="24" />
            <a href="/raymondlaghaeian">raymondlaghaeian</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@v-stbee" height="24" src="https://avatars0.githubusercontent.com/u/30939106?v=4&amp;s=48" width="24" />
            <a href="/v-stbee">v-stbee</a>
          </li>
          <li class="facebox-user-list-item">
            <img alt="@vDonGlover" height="24" src="https://avatars3.githubusercontent.com/u/17439056?v=4&amp;s=48" width="24" />
            <a href="/vDonGlover">vDonGlover</a>
          </li>
      </ul>
    </div>
  </div>


  <div class="file">
    <div class="file-header">
  <div class="file-actions">

    <div class="BtnGroup">
      <a href="/Azure/Machine-Learning-Operationalization/raw/master/documentation/aml-cli-reference.md" class="btn btn-sm BtnGroup-item" id="raw-url">Raw</a>
        <a href="/Azure/Machine-Learning-Operationalization/blame/master/documentation/aml-cli-reference.md" class="btn btn-sm js-update-url-with-hash BtnGroup-item" data-hotkey="b">Blame</a>
      <a href="/Azure/Machine-Learning-Operationalization/commits/master/documentation/aml-cli-reference.md" class="btn btn-sm BtnGroup-item" rel="nofollow">History</a>
    </div>

        <a class="btn-octicon tooltipped tooltipped-nw"
           href="https://desktop.github.com"
           aria-label="Open this file in GitHub Desktop"
           data-ga-click="Repository, open with desktop, type:windows">
            <svg aria-hidden="true" class="octicon octicon-device-desktop" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"/></svg>
        </a>

        <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/Azure/Machine-Learning-Operationalization/edit/master/documentation/aml-cli-reference.md" class="inline-form js-update-url-with-hash" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="D8Vn6Tm6rrwZxlr5N+/7beJOK3Ifq+3GLPkIPd0PqhF5PgscWbwuwyEltQE9FZvqfbIemuUYhnslQoSAIJ3UHA==" /></div>
          <button class="btn-octicon tooltipped tooltipped-nw" type="submit"
            aria-label="Edit the file in your fork of this project" data-hotkey="e" data-disable-with>
            <svg aria-hidden="true" class="octicon octicon-pencil" height="16" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 0 1 1.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"/></svg>
          </button>
</form>        <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="/Azure/Machine-Learning-Operationalization/delete/master/documentation/aml-cli-reference.md" class="inline-form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /><input name="authenticity_token" type="hidden" value="Pr5xP+69hRcKUNEILCsgH89tQpb5g8Hnpq9k4fpg9RVVujfTxeZAihs6ZOEIznb6J6JEoAeydk4oB/tanbmD/w==" /></div>
          <button class="btn-octicon btn-octicon-danger tooltipped tooltipped-nw" type="submit"
            aria-label="Delete the file in your fork of this project" data-disable-with>
            <svg aria-hidden="true" class="octicon octicon-trashcan" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/></svg>
          </button>
</form>  </div>

  <div class="file-info">
      348 lines (241 sloc)
      <span class="file-info-divider"></span>
    15.9 KB
  </div>
</div>

    
  <div id="readme" class="readme blob instapaper_body">
    <article class="markdown-body entry-content" itemprop="text"><h1><a id="user-content-model-management-command-line-interface-reference" class="anchor" href="#model-management-command-line-interface-reference" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Model Management Command Line Interface Reference</h1>
<p>You can update your Azure Machine Learning command line interface (CLI) installation using pip. To perform the update, you must have sufficient permissions.</p>
<p><strong>Linux</strong>: On Linux you must be running under sudo:</p>
<pre><code>$ sudo -i
</code></pre>
<p>Then issue the following command:</p>
<pre><code># wget -q https://raw.githubusercontent.com/Azure/Machine-Learning-Operationalization/master/scripts/amlupdate.sh -O - | sudo bash -
</code></pre>
<p><strong>Windows</strong>: On Windows, you must run the command as administrator.</p>
<p>First, open a command prompt with administrator privileges. Press the Window key and type <code>cmd</code>. Right-click on the <strong>Command Prompt</strong> icon and select <strong>Run as administrator</strong> from the context menu.</p>
<p>Then type the following command:</p>
<pre><code>pip install azure-cli-ml
</code></pre>
<h2><a id="user-content-base-cli-concepts" class="anchor" href="#base-cli-concepts" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Base CLI concepts:</h2>
<pre><code>account : Manage model management accounts.	
env     : Manage compute environments.
image   : Manage operationalization images.
manifest: Manage operationalization manifests.
model   : Manage operationalization models.
service : Manage operationalized services.
</code></pre>
<h2><a id="user-content-account-commands" class="anchor" href="#account-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Account commands</h2>
<p>A model management account is required to use the services, which allow you to deploy and manage models. Use <code>az ml account modelmanagement -h</code> to see the following list:</p>
<pre><code>create: Create a Model Management Account.
delete: Delete a specified Model Management Account.
list  : Get the Model Management Accounts in the current subscription.
set   : Set the active Model Management Account.
show  : Show a Model Management Account.
update: Update an existing Model Management Account.
</code></pre>
<p><strong>Create a Model Management Account</strong></p>
<p>Create a model management account using the following command. This account will be used for billing.</p>
<p><code>az ml account modelmanagement create --location [Azure region e.g. eastus2] --name [new account name] --resource-group [resource group name to store the account in]</code></p>
<p>Command details:</p>
<pre><code>--location -l      : [Required] Resource location.
--name -n          : [Required] Name of the model management account.
--resource-group -g: [Required] Resource group to create the model management account in.
--description -d   : Description of the model management account.
--sku-instances    : Number of instances of the selected SKU. Must be between 1 and 16 inclusive. Default: 1.
--sku-name         : SKU name. Valid names are S1|S2|S3|DevTest.  Default: S1.
--tags -t          : Tags for the model management account.  Default: {}.
-v                 : Verbosity flag.
</code></pre>
<p><strong>Set the active Model Management Account</strong></p>
<p>Set the active model management account using the following command:</p>
<p><code>az ml account modelmanagement set --name [account name] --resource-group [resource group name associated with the account]</code></p>
<p>Command details:</p>
<pre><code>--name -n          : [Required] Name of model management account to set.
--resource-group -g: [Required] Resource group containing the model management account to set.
-v                 : Verbosity flag.
</code></pre>
<h2><a id="user-content-environment-commands" class="anchor" href="#environment-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Environment commands</h2>
<p>Use <code>az ml env -h</code> to see the following list:</p>
<pre><code>cluster        : Switch the current execution context to 'cluster'.
delete         : Delete an MLCRP-provisioned resource.
get-credentials: List the keys for an environment.
list           : List all environments in the current subscription.
local          : Switch the current execution context to 'local'.
set            : Set the active MLC environment.
setup          : Sets up an MLC environment.
show           : Show an MLC resource; if resource_group or cluster_name are not provided, shows the active MLC env.
</code></pre>
<p><strong>Switch to 'cluster'</strong>
Use <code>az ml env cluster</code> to switch the current execution context to 'cluster'.</p>
<p><strong>List environment credentials</strong></p>
<p>Use <code>az ml env get-credentials --cluster-name [compute resource] --resource-group [resource group compute resource]</code> to list the credentials for the environment.</p>
<p>Command details:</p>
<pre><code>--cluster-name -n       : [Required] Name of compute resource to retrieve keys for.
--resource-group -g     : [Required] Resource group compute resource to retrieve keys for.
--install-kube-config -i: Flag to save Kubernetes configuration to file. If value not provided, will install to ~/.kube/config.
-v                      : Verbosity flag.
</code></pre>
<p><strong>Switch to 'local'</strong></p>
<p>Use <code>az ml env local</code> to switch the current execution context to 'local'.</p>
<p><strong>Set the active MLC environment</strong></p>
<p>Use <code>az ml env set --cluster-name [cluster name] --resource-group [resource group]</code> to set the active MLC environment.</p>
<p>Command details:</p>
<pre><code>--cluster-name -n  : [Required] Name of cluster to provision.
--resource-group -g: [Required] Resource group of compute resource to set as active resource.
</code></pre>
<p><strong>Set up the Deployment Environment</strong></p>
<p>When setting up the deployment environment, there are two options for deployment: <em>local</em> and <em>cluster</em>. Setting the <code>--cluster</code> (or <code>-c</code>) flag enables cluster deployment. The basic setup syntax is as follows:</p>
<p><code>az ml env setup [-c] --location [location of environment resources, e.g. eastus2] --name[name of environment]</code></p>
<p>This command initializes your Azure machine learning environment with a storage account, ACR registry, App Insights service, and an ACS cluster created in your subscription. By default, the environment is initialized for local deployments only (no ACS) if no flag is specified. If you need to scale service, specify the <code>--cluster</code> (or <code>-c</code>) flag to create an ACS cluster.</p>
<p>Command details:</p>
<pre><code>--location -l                  : [Required] Location for environment resources; an Azure region, e.g. eastus2.
--name -n                      : [Required] Name of environment to provision.
--acr -r                       : ARM ID of ACR to associate with this environment.
--agent-count -z               : Number of agents to provision in the ACS cluster. Default: 3.
--cert-cname                   : CNAME of certificate.
--cert-pem                     : Path to .pem file with certificate bytes.
--cluster -c                   : Flag to provision ACS cluster. Off by default; specify this to force an ACS cluster deployment.
--key-pem                      : Path to .pem file with certificate key.
--master-count -m              : Number of master nodes to provision in the ACS cluster. Acceptable values: 1, 3, 5. Default: 1.
--resource-group -g            : Resource group in which to create compute resource. Will be created if it does not exist.
                                 If not provided, resource group will be created with 'rg' appended to 'name.'.
--service-principal-app-id -a  : App ID of service principal to use for configuring ML compute.
--service-principal-password -p: Password associated with service principal.
--storage -s                   : ARM ID of storage account to associate with this environment.
--yes -y                       : Flag to answer 'yes' to any prompts. Command will fail if user is not logged in.
</code></pre>
<h2><a id="user-content-image-commands" class="anchor" href="#image-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Image commands</h2>
<pre><code>create: Create an Operationalization Image. This command has two different sets of required arguments,
        depending on if you want to use a previously created manifest.
list
show
usage
</code></pre>
<p><strong>Create image</strong></p>
<p><strong>Note:</strong> The <code>create service command</code> can perform the <code>create image</code> operation, so you don't have to create an image separately.</p>
<p>You can create an image with the option of having registered it before, or you can register it with a single command. Each option is shown below.</p>
<p><code>az ml image create -n [image name] -manifest-id [manifest ID]</code></p>
<p><code>az ml image create -n [image name] --model-file [model file or folder path] -f [code file, e.g. the score.py file] -r [the runtime, e.g. spark-py which is the Docker container image base]</code></p>
<p>Command details:</p>
<pre><code>--image-name -n    : [Required] The name of the image being created.
--image-description: Description of the image.
--image-type       : The image type to create. Defaults to "Docker".
-v                 : Verbosity flag.
</code></pre>
<p>Registered Manifest Arguments
--manifest-id      : [Required] ID of previously registered manifest to use in image creation.</p>
<p>Unregistered Manifest Arguments
--conda-file -c    : Path to Conda Environment file.
--dependency -d    : Files and directories required by the service. Multiple dependencies can be specified
with additional -d arguments.
--model-file -m    : [Required] Model file to register.
--schema-file -s   : Schema file to add to the manifest.
-f                 : [Required] The code file to be deployed.
-p                 : A pip requirements.txt file needed by the code file.
-r                 : [Required] Runtime of the web service. Valid runtimes are python|spark-py.</p>
<p><strong>Image usage</strong></p>
<p>Use <code>az ml image usage --image-id [image ID]</code> to show the usage of the specified image.</p>
<p>Command details:</p>
<pre><code>--image-id -i: [Required] ID of image to show.
-v           : Verbosity flag.
</code></pre>
<h2><a id="user-content-manifest-commands" class="anchor" href="#manifest-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Manifest commands</h2>
<pre><code>create: Create an Operationalization Manifest. This command has two different sets of required arguments,
        depending on if you want to use previously registered model/s.
list
show
</code></pre>
<p><strong>Create manifest</strong></p>
<p>Creates a manifest file for the model. The <code>service create</code> command performs the manifest creation without requiring separate registration.</p>
<p><code>az ml manifest create --manifest-name [your new manifest name] -f [path to code file] -r [runtime for the image, e.g. spark-py]</code></p>
<p>Command details:</p>
<pre><code>--manifest-name -n    : [Required] Name of the manifest to create.
-f                    : [Required] The code file to be deployed.
-r                    : [Required] Runtime of the web service. Valid runtimes are spark-py|python.
--conda-file -c       : Path to Conda Environment file.
--dependency -d       : Files and directories required by the service. Multiple dependencies can be
                        specified with additional -d arguments.
--manifest-description: Description of the manifest.
--schema-file -s      : Schema file to add to the manifest.
-p                    : A pip requirements.txt file needed by the code file.
-v                    : Verbosity flag.
</code></pre>
<p>Registered Model Arguments
--model-id -i         : [Required] ID of previously registered model to add to manifest.
Multiple models can be specified with additional -i arguments.</p>
<p>Unregistered Model Arguments
--model-file -m       : [Required] Model file to register. If used, must be combined with model name.</p>
<h2><a id="user-content-model-commands" class="anchor" href="#model-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Model commands</h2>
<pre><code>list
register
show
</code></pre>
<p><strong>Register a model</strong></p>
<p>Command to register the model. The <code>service create</code> command performs the model registration without requiring separate registration.</p>
<p><code>az ml model register --model [path to model file] --name [model name]</code></p>
<p>Command details:</p>
<pre><code>--model -m      : [Required] Model to register.
--name -n       : [Required] Name of model to register.
--description -d: Description of the model.
--tag -t        : Tags for the model. Multiple tags can be specified with additional -t arguments.
-v              : Verbosity flag.
</code></pre>
<h2><a id="user-content-service-commands" class="anchor" href="#service-commands" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Service commands</h2>
<pre><code>create
delete
keys
list
logs
run
show
update
usage
</code></pre>
<p><strong>Create a service</strong></p>
<p>In the following command, the schema must use the <code>generate-schema</code> command available through the Azure ML SDK (see samples for more info on the schema creation).</p>
<p><code>az ml service create realtime --imageid [image to deploy] -n [service name]</code></p>
<p><code>az ml service create realtime --model-file [path to model file(s)] -f [path to model scoring file, e.g. score.py] -n [service name] -r [run time included in the image, e.g. spark-py]</code></p>
<p>Command details:</p>
<pre><code>-n                                : [Required] Webservice name.
--autoscale-enabled               : Enable automatic scaling of service replicas based on request demand.
                                    Allowed values: true, false. False if omitted.  Default: false.
--autoscale-max-replicas          : If autoscale is enabled - sets the maximum number of replicas.
--autoscale-min-replicas          : If autoscale is enabled - sets the minimum number of replicas.
--autoscale-refresh-period-seconds: If autoscale is enabled - the interval of evaluating scaling demand.
--autoscale-target-utilization    : If autoscale is enabled - target utilization of replicas time.
--collect-model-data              : Enable model data collection. Allowed values: true, false. False if omitted.  Default: false.
--cpu                             : Reserved number of CPU cores per service replica (can be fraction).
--enable-app-insights -l          : Enable app insights. Allowed values: true, false. False if omitted.  Default: false.
--memory                          : Reserved amount of memory per service replica, in M or G. (ex. 1G, 300M).
--replica-max-concurrent-requests : Maximum number of concurrent requests that can be routed to a service replica.
-v                                : Verbosity flag.
-z                                : Number of replicas for a Kubernetes service.  Default: 1.
</code></pre>
<p>Registered Image Arguments
--image-id                        : [Required] Image to deploy to the service.</p>
<p>Unregistered Image Arguments
--conda-file -c                   : Path to Conda Environment file.
--image-type                      : The image type to create. Defaults to "Docker".
--model-file -m                   : [Required] The model to be deployed.
-d                                : Files and directories required by the service. Multiple dependencies can be specified
with additional -d arguments.
-f                                : [Required] The code file to be deployed.
-p                                : A pip requirements.txt file of package needed by the code file.
-r                                : [Required] Runtime of the web service. Valid runtimes are python|spark-py.
-s                                : Input and output schema of the web service.</p>
<p>Note on the <code>-d</code> flag for attaching dependencies: If you pass the name of a non-bundled directory (not zip, tar, etc.), that directory automatically gets tar’ed, passed along, and then automatically unbundled on the other end. If you pass in a directory that is already bundled, it is treated as a file and passed along as is. It will not be unbundled automatically; you are expected to handle that in your code.</p>
<p><strong>Get the keys for a service</strong></p>
<p><code>az ml service keys realtime --id [service ID]</code></p>
<p>Arguments
--id -i [Required]: Service ID.
--regen -r        : Flag to specify to regenerate keys for the specified service.
-v                : Verbosity flag.</p>
<p><strong>Get service logs</strong></p>
<p>Either a service name or a service ID is required.</p>
<p><code>az ml service keys realtime --service-id [service ID]</code>
<code>az ml service keys realtime --service-name [service name]</code></p>
<pre><code>--kube-config -k : Kubeconfig of the cluster to get logs from.
--request-id -r  : Request ID to filter the logs by.
--service-id -i  : Service ID.
--service-name -n: Service Name.
-v               : Verbosity flag.
</code></pre>
<p><strong>Run the service</strong></p>
<p><code>az ml service run realtime -i [service ID]</code></p>
<p>Command details:</p>
<pre><code>--id -i    : [Required] The service id to score against.
-d         : The data to use for calling the web service.
-v         : Verbosity flag.
</code></pre>
<p><strong>Get service details</strong></p>
<p>Get service details including URL and usage (including sample data if a schema was created). Either a service name or a service ID is required.</p>
<p><code>az ml service show realtime --name [service name]</code>
<code>az ml service show realtime --id [service ID]</code></p>
<p>Command details:</p>
<pre><code>--id -i  : The service id to show.
--name -n: Webservice name.
-v       : Verbosity flag.
</code></pre>
<p><strong>Service usage</strong></p>
<p><code>az ml service usage realtime --id [service ID]</code></p>
<p>Command details:</p>
<pre><code>--id -i: [Required] Service ID.
-v     : Verbosity flag.
</code></pre>
</article>
  </div>

  </div>

  <button type="button" data-facebox="#jump-to-line" data-facebox-class="linejump" data-hotkey="l" class="d-none">Jump to Line</button>
  <div id="jump-to-line" style="display:none">
    <!-- '"` --><!-- </textarea></xmp> --></option></form><form accept-charset="UTF-8" action="" class="js-jump-to-line-form" method="get"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&#x2713;" /></div>
      <input class="form-control linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" aria-label="Jump to line" autofocus>
      <button type="submit" class="btn">Go</button>
</form>  </div>

  </div>
  <div class="modal-backdrop js-touch-events"></div>
</div>

    </div>
  </div>

  </div>

      
<div class="footer container-lg px-3" role="contentinfo">
  <div class="position-relative d-flex flex-justify-between py-6 mt-6 f6 text-gray border-top border-gray-light ">
    <ul class="list-style-none d-flex flex-wrap ">
      <li class="mr-3">&copy; 2017 <span title="0.17118s from unicorn-2916912039-sv1hw">GitHub</span>, Inc.</li>
        <li class="mr-3"><a href="https://github.com/site/terms" data-ga-click="Footer, go to terms, text:terms">Terms</a></li>
        <li class="mr-3"><a href="https://github.com/site/privacy" data-ga-click="Footer, go to privacy, text:privacy">Privacy</a></li>
        <li class="mr-3"><a href="https://github.com/security" data-ga-click="Footer, go to security, text:security">Security</a></li>
        <li class="mr-3"><a href="https://status.github.com/" data-ga-click="Footer, go to status, text:status">Status</a></li>
        <li><a href="https://help.github.com" data-ga-click="Footer, go to help, text:help">Help</a></li>
    </ul>

    <a href="https://github.com" aria-label="Homepage" class="footer-octicon" title="GitHub">
      <svg aria-hidden="true" class="octicon octicon-mark-github" height="24" version="1.1" viewBox="0 0 16 16" width="24"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
</a>
    <ul class="list-style-none d-flex flex-wrap ">
        <li class="mr-3"><a href="https://github.com/contact" data-ga-click="Footer, go to contact, text:contact">Contact GitHub</a></li>
      <li class="mr-3"><a href="https://developer.github.com" data-ga-click="Footer, go to api, text:api">API</a></li>
      <li class="mr-3"><a href="https://training.github.com" data-ga-click="Footer, go to training, text:training">Training</a></li>
      <li class="mr-3"><a href="https://shop.github.com" data-ga-click="Footer, go to shop, text:shop">Shop</a></li>
        <li class="mr-3"><a href="https://github.com/blog" data-ga-click="Footer, go to blog, text:blog">Blog</a></li>
        <li><a href="https://github.com/about" data-ga-click="Footer, go to about, text:about">About</a></li>

    </ul>
  </div>
</div>



  <div id="ajax-error-message" class="ajax-error-message flash flash-error">
    <svg aria-hidden="true" class="octicon octicon-alert" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .19.31.52.5.87.5h13.7c.36 0 .69-.19.86-.5.17-.31.18-.69.01-1L8.865 1.52zM8.995 13h-2v-2h2v2zm0-3h-2V6h2v4z"/></svg>
    <button type="button" class="flash-close js-flash-close js-ajax-error-dismiss" aria-label="Dismiss error">
      <svg aria-hidden="true" class="octicon octicon-x" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"/></svg>
    </button>
    You can't perform that action at this time.
  </div>


    
    <script crossorigin="anonymous" integrity="sha256-Sxs+Reu4luxVVaYLalcHLGmPG0uGt2qgtP4QZ/RAsfM=" src="https://assets-cdn.github.com/assets/frameworks-4b1b3e45ebb896ec5555a60b6a57072c698f1b4b86b76aa0b4fe1067f440b1f3.js"></script>
    
    <script async="async" crossorigin="anonymous" integrity="sha256-8uI0Q/TXf4ugx0+sVE7JpMYF17Md+ooNyKOWILTjpu4=" src="https://assets-cdn.github.com/assets/github-f2e23443f4d77f8ba0c74fac544ec9a4c605d7b31dfa8a0dc8a39620b4e3a6ee.js"></script>
    
    
    
    
  <div class="js-stale-session-flash stale-session-flash flash flash-warn flash-banner d-none">
    <svg aria-hidden="true" class="octicon octicon-alert" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .19.31.52.5.87.5h13.7c.36 0 .69-.19.86-.5.17-.31.18-.69.01-1L8.865 1.52zM8.995 13h-2v-2h2v2zm0-3h-2V6h2v4z"/></svg>
    <span class="signed-in-tab-flash">You signed in with another tab or window. <a href="">Reload</a> to refresh your session.</span>
    <span class="signed-out-tab-flash">You signed out in another tab or window. <a href="">Reload</a> to refresh your session.</span>
  </div>
  <div class="facebox" id="facebox" style="display:none;">
  <div class="facebox-popup">
    <div class="facebox-content" role="dialog" aria-labelledby="facebox-header" aria-describedby="facebox-description">
    </div>
    <button type="button" class="facebox-close js-facebox-close" aria-label="Close modal">
      <svg aria-hidden="true" class="octicon octicon-x" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z"/></svg>
    </button>
  </div>
</div>


  </body>
</html>

