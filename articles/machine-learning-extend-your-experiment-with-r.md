<properties
	pageTitle="Extend your experiment with R | Azure"
	description="How to extend the functionality of Azure Machine Learning Studio through the R language by using the Execute R Script module."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/29/2015"
	ms.author="garye" />


#Extend your experiment with R 

You can extend the functionality of ML Studio through the R language by using the [Execute R Script][execute-r-script] module. 

This module accepts multiple input datasets and it yields a single dataset as output. You can type an R script into the **R Script** parameter of the [Execute R Script][execute-r-script] module. 

You access each input port of the module by using code similar to the following: 

    dataset1 <- maml.mapInputPort(1)

[AZURE.INCLUDE [machine-learning-free-trial](../includes/machine-learning-free-trial.md)]

##Listing all currently-installed packages

The list of installed packages can change. To get the complete list, include the following lines in the [Execute R Script][execute-r-script] module to send the list to the output dataset:

    out <- data.frame(installed.packages())
    maml.mapOutputPort("out")

To view the package list, connect a conversion module such as [Convert to CSV][convert-to-csv] to the output of the [Execute R Script][execute-r-script] module, run the experiment, then click the output of the conversion module and select **Download**.

##Importing packages

You also can import packages that are not already installed from a staged ML Studio repository by using the following commands in the [Execute R Script][execute-r-script] module and zipped package archive: 

    install.packages("src/my_favorite_package.zip", lib = ".", repos = NULL, verbose = TRUE)
    success <- library("my_favorite_package", lib.loc = ".", logical.return = TRUE, verbose = TRUE)

where the `my_favorite_package.zip` contains the zip of your package.

##List of installed packages

For your convenience, the list of packages included in the current release is provided in the following table.

To get the complete list of packages that are currently available, see the section titled **Listing all currently-installed packages** above. Current R documentation is available [here](http://cran.r-project.org/manuals.html).

- [R modules beginning with A through E]
- [R modules beginning with F through L]
- [R modules beginning with M through R]
- [R modules beginning with S through Z]

[R modules beginning with A through E]: #r-modules-beginning-with-a-through-e
[R modules beginning with F through L]: #r-modules-beginning-with-f-through-l
[R modules beginning with M through R]: #r-modules-beginning-with-m-through-r
[R modules beginning with S through Z]: #r-modules-beginning-with-s-through-z


###R modules beginning with A through E

| Package name | Package description |
| ------------ | ------------------- |
| abc | Tools for Approximate Bayesian Computation (ABC) |
| abind | Combine multi-dimensional arrays |
| actuar | Actuarial functions |
| ade4 | Analysis of Ecological Data : Exploratory and Euclidean methods in Environmental sciences |
| AdMit | Adaptive Mixture of Student-t distributions |
| aod | Analysis of Overdispersed Data |
| ape | Analyses of Phylogenetics and Evolution |
| approximator | Bayesian prediction of complex computer codes |
| arm | Data Analysis Using Regression and Multilevel/Hierarchical Models |
| arules | Mining Association Rules and Frequent Itemsets |
| arulesViz | Visualizing Association Rules and Frequent Itemsets |
| ash | David Scott's ASH routines |
| assertthat | Easy pre and post assertions |
| AtelieR | A GTK GUI for teaching basic concepts in statistical inference, and doing elementary bayesian tests |
| BaBooN | Bayesian Bootstrap Predictive Mean Matching - Multiple and single imputation for discrete data |
| BACCO | Bayesian Analysis of Computer Code Output (BACCO) |
| BaM | Functions and datasets for books by Jeff Gill |
| bark | Bayesian Additive Regresssion Kernels |
| BAS | Bayesian Model Averaging using Bayesian Adaptive Sampling |
| base | The R Base Package |
| BayesDA | Functions and Datasets for the book Bayesian Data Analysis |
| bayesGARCH | Bayesian Estimation of the GARCH(1,1) Model with Student-t Innovations |
| bayesm | Bayesian Inference for Marketing/Micro-econometrics |
| bayesmix | Bayesian Mixture Models with JAGS |
| bayesQR | Bayesian quantile regression |
| bayesSurv | Bayesian Survival Regression with Flexible Error and Random Effects Distributions |
| Bayesthresh | Bayesian thresholds mixed-effects models for categorical data |
| BayesTree | Bayesian Methods for Tree Based Models |
| BayesValidate | BayesValidate Package |
| BayesX | R Utilities Accompanying the Software Package BayesX |
| BayHaz | R Functions for Bayesian Hazard Rate Estimation |
| bbemkr | Bayesian bandwidth estimation for multivariate kernel regression with Gaussian error |
| BCBCSF | Bias-corrected Bayesian Classification with Selected Features |
| BCE | Bayesian composition estimator: estimating sample (taxonomic) composition from biomarker data |
| bclust | Bayesian clustering using spike-and-slab hierarchical model, suitable for clustering high-dimensional data |
| bcp | A Package for Performing a Bayesian Analysis of Change Point Problems |
| BenfordTests | Statistical Tests for Evaluating Conformity to Benford's Law |
| bfp | Bayesian Fractional Polynomials |
| BH | Boost C++ header files |
| bisoreg | Bayesian Isotonic Regression with Bernstein Polynomials |
| bit | A class for vectors of 1-bit booleans |
| bitops | Bitwise Operations |
| BLR | Bayesian Linear Regression |
| BMA | Bayesian Model Averaging |
| Bmix | Bayesian Sampling for Stick-breaking Mixtures |
| BMS | Bayesian Model Averaging Library |
| bnlearn | Bayesian network structure learning, parameter learning and inference |
| boa | Bayesian Output Analysis Program (BOA) for MCMC |
| Bolstad | Bolstad functions |
| boot | Bootstrap Functions (originally by Angelo Canty for S) |
| bootstrap | Functions for the book An Introduction to the Bootstrap |
| bqtl | Bayesian QTL mapping toolkit |
| BradleyTerry2 | Bradley-Terry Models |
| brew | Templating Framework for Report Generation |
| brglm | Bias reduction in binomial-response generalized linear models |
| bspec | Bayesian spectral inference |
| bspmma | bspmma: Bayesian Semiparametric Models for Meta-Analysis |
| BVS | Bayesian Variant Selection: Bayesian Model Uncertainty Techniques for Genetic Association Studies |
| cairoDevice | Cairo-based cross-platform antialiased graphics device driver |
| calibrator | Bayesian calibration of complex computer codes |
| car | Companion to Applied Regression |
| caret | Classification and Regression Training |
| catnet | Categorical Bayesian Network Inference |
| caTools | Tools: moving window statistics, GIF, Base64, ROC AUC, etc. |
| chron | Chronological objects which can handle dates and times |
| class | Functions for Classification |
| cluster | Cluster Analysis Extended Rousseeuw et al. |
| clusterSim | Searching for optimal clustering procedure for a data set |
| coda | Output analysis and diagnostics for MCMC |
| codetools | Code Analysis Tools for R |
| coin | Conditional Inference Procedures in a Permutation Test Framework |
| colorspace | Color Space Manipulation |
| combinat | combinatorics utilities |
| compiler | The R Compiler Package |
| corpcor | Efficient Estimation of Covariance and (Partial) Correlation |
| cslogistic | Conditionally Specified Logistic Regression |
| ctv | CRAN Task Views |
| cubature | Adaptive multivariate integration over hypercubes |
| data.table | Extension of data.frame |
| datasets | The R Datasets Package |
| date | Functions for handling dates |
| dclone | Data Cloning and MCMC Tools for Maximum Likelihood Methods |
| deal | Learning Bayesian Networks with Mixed Variables |
| Deducer | Deducer: A data analysis GUI for R |
| DeducerExtras | Additional dialogs and functions for Deducer |
| deldir | Delaunay Triangulation and Dirichlet (Voronoi) Tessellation. |
| DEoptimR | Differential Evolution Optimization in pure R |
| deSolve | General Solvers for Initial Value Problems of Ordinary Differential Equations (ODE), Partial Differential Equations (PDE), Differential Algebraic Equations (DAE), and Delay Differential Equations (DDE) |
| devtools | Tools to make developing R code easier |
| dichromat | Color Schemes for Dichromats |
| digest | Create cryptographic hash digests of R objects |
| distrom | Distributed Multinomial Regression |
| dlm | Bayesian and Likelihood Analysis of Dynamic Linear Models |
| doSNOW | Foreach parallel adaptor for the snow package |
| dplyr | dplyr: a grammar of data manipulation |
| DPpackage | Bayesian nonparametric modeling in R |
| dse | Dynamic Systems Estimation (time series package) |
| e1071 | Misc Functions of the Department of Statistics (e1071), TU Wien |
| EbayesThresh | Empirical Bayes Thresholding and Related Methods |
| ebdbNet | Empirical Bayes Estimation of Dynamic Bayesian Networks |
| effects | Effect Displays for Linear, Generalized Linear, Multinomial-Logit, Proportional-Odds Logit Models and Mixed-Effects Models |
| emulator | Bayesian emulation of computer programs |
| ensembleBMA | Probabilistic Forecasting using Ensembles and Bayesian Model Averaging |
| entropy | Estimation of Entropy, Mutual Information and Related Quantities |
| EvalEst | Dynamic Systems Estimation - extensions |
| evaluate | Parsing and evaluation tools that provide more details than the default |
| evdbayes | Bayesian Analysis in Extreme Value Theory |
| evora | Epigenetic Variable Outliers for Risk prediction Analysis |
| exactLoglinTest | Monte Carlo Exact Tests for Log-linear models |
| expm | Matrix exponential |
| extremevalues | Univariate outlier detection |


###R modules beginning with F through L

| Package name | Package description |
| ------------ | ------------------- |
| factorQR | Bayesian quantile regression factor models |
| faoutlier | Influential case detection methods for factor analysis and SEM |
| fitdistrplus | Help to fit of a parametric distribution to non-censored or censored data |
| FME | A Flexible Modelling Environment for Inverse Modelling, Sensitivity, Identifiability, Monte Carlo Analysis |
| foreach | Foreach looping construct for R |
| forecast | Forecasting functions for time series and linear models |
| foreign | Read Data Stored by Minitab, S, SAS, SPSS, Stata, Systat, Weka, dBase, ... |
| formatR | Format R Code Automatically |
| Formula | Extended Model Formulas |
| fracdiff | Fractionally differenced ARIMA aka ARFIMA(p,d,q) models |
| gam | Generalized Additive Models |
| gamlr | Gamma Lasso Regression |
| gbm | Generalized Boosted Regression Models |
| gclus | Clustering Graphics |
| gdata | Various R programming tools for data manipulation |
| gee | Generalized Estimation Equation solver |
| genetics | Population Genetics |
| geoR | Analysis of geostatistical data |
| geoRglm | geoRglm - a package for generalised linear spatial models |
| geosphere | Spherical Trigonometry |
| ggmcmc | Graphical tools for analyzing Markov Chain Monte Carlo simulations from Bayesian inference |
| ggplot2 | An implementation of the Grammar of Graphics |
| glmmBUGS | Generalised Linear Mixed Models and Spatial Models with WinBUGS, BRugs, or OpenBUGS |
| glmnet | Lasso and elastic-net regularized generalized linear models |
| gmodels | Various R programming tools for model fitting |
| gmp | Multiple Precision Arithmetic |
| gnm | Generalized Nonlinear Models |
| googlePublicData | An R library to build Google's Public Data Explorer DSPL Metadata files |
| googleVis | Interface between R and Google Charts |
| GPArotation | GPA Factor Rotation |
| gplots | Various R programming tools for plotting data |
| graphics | The R Graphics Package |
| grDevices | The R Graphics Devices and Support for Colours and Fonts |
| gregmisc | Greg's Miscellaneous Functions |
| grid | The Grid Graphics Package |
| gridExtra | functions in Grid graphics |
| growcurves | Bayesian semi and nonparametric growth curve models that additionally include multiple membership random effects |
| grpreg | Regularization paths for regression models with grouped covariates |
| gsubfn | Utilities for strings and function arguments |
| gtable | Arrange grobs in tables |
| gtools | Various R programming tools |
| gWidgets | gWidgets API for building toolkit-independent, interactive GUIs |
| gWidgetsRGtk2 | Toolkit implementation of gWidgets for RGtk2 |
| haplo.stats | Statistical Analysis of Haplotypes with Traits and Covariates when Linkage Phase is Ambiguous |
| hbsae | Hierarchical Bayesian Small Area Estimation |
| hdrcde | Highest density regions and conditional density estimation |
| heavy | Package for outliers accommodation using heavy-tailed distributions |
| hflights | Flights that departed Houston in 2011 |
| HH | Statistical Analysis and Data Display: Heiberger and Holland |
| HI | Simulation from distributions supported by nested hyperplanes |
| highr | Syntax highlighting for R |
| Hmisc | Harrell Miscellaneous |
| htmltools | Tools for HTML |
| httpuv | HTTP and WebSocket server library |
| httr | Tools for working with URLs and HTTP |
| IBrokers | R API to Interactive Brokers Trader Workstation |
| igraph | Network analysis and visualization |
| intervals | Tools for working with points and intervals |
| iplots | iPlots - interactive graphics for R |
| ipred | Improved Predictors |
| irr | Various Coefficients of Interrater Reliability and Agreement |
| iterators | Iterator construct for R |
| JavaGD | Java Graphics Device |
| JGR | JGR - Java GUI for R |
| kernlab | Kernel-based Machine Learning Lab |
| KernSmooth | Functions for kernel smoothing for Wand and Jones (1995) |
| KFKSDS | Kalman Filter, Smoother and Disturbance Smoother |
| kinship2 | Pedigree functions |
| kknn | Weighted k-Nearest Neighbors |
| klaR | Classification and visualization |
| knitr | A general-purpose package for dynamic report generation in R |
| ks | Kernel smoothing |
| labeling | Axis Labeling |
| Lahman | Sean Lahman's Baseball Database |
| lars | Least Angle Regression, Lasso and Forward Stagewise |
| lattice | Lattice Graphics |
| latticeExtra | Extra Graphical Utilities Based on Lattice |
| lava | Linear Latent Variable Models |
| lavaan | Latent Variable Analysis |
| leaps | regression subset selection |
| LearnBayes | Functions for Learning Bayesian Inference |
| limSolve | Solving Linear Inverse Models |
| lme4 | Linear mixed-effects models using Eigen and S4 |
| lmm | Linear mixed models |
| lmPerm | Permutation tests for linear models |
| lmtest | Testing Linear Regression Models |
| locfit | Local Regression, Likelihood and Density Estimation |
| lpSolve | Interface to Lp_solve v. 5.5 to solve linear/integer programs |


###R modules beginning with M through R

| Package name | Package description |
| ------------ | ------------------- |
| magic | create and investigate magic squares |
| magrittr | magrittr - a forward-pipe operator for R |
| mapdata | Extra Map Databases |
| mapproj | Map Projections |
| maps | Draw Geographical Maps |
| maptools | Tools for reading and handling spatial objects |
| maptree | Mapping, pruning, and graphing tree models |
| markdown | Markdown rendering for R |
| MASS | Support Functions and Datasets for Venables and Ripley's MASS |
| MasterBayes | ML and MCMC Methods for Pedigree Reconstruction and Analysis |
| Matrix | Sparse and Dense Matrix Classes and Methods |
| matrixcalc | Collection of functions for matrix calculations |
| MatrixModels | Modelling with Sparse And Dense Matrices |
| maxent | Low-memory Multinomial Logistic Regression with Support for Text Classification |
| maxLik | Maximum Likelihood Estimation |
| mcmc | Markov Chain Monte Carlo |
| MCMCglmm | MCMC Generalised Linear Mixed Models |
| MCMCpack | Markov chain Monte Carlo (MCMC) Package |
| memoise | Memoise functions |
| methods | Formal Methods and Classes |
| mgcv | Mixed GAM Computation Vehicle with GCV/AIC/REML smoothness estimation |
| mice | Multivariate Imputation by Chained Equations |
| microbenchmark | Sub microsecond accurate timing functions |
| mime | Map filenames to MIME types |
| minpack.lm | R interface to the Levenberg-Marquardt nonlinear least-squares algorithm found in MINPACK, plus support for bounds |
| minqa | Derivative-free optimization algorithms by quadratic approximation |
| misc3d | Miscellaneous 3D Plots |
| miscF | Miscellaneous Functions |
| miscTools | Miscellaneous Tools and Utilities |
| mixtools | Tools for analyzing finite mixture models |
| mlbench | Machine Learning Benchmark Problems |
| mlogitBMA | Bayesian Model Averaging for Multinomial Logit Models |
| mnormt | The multivariate normal and t distributions |
| MNP | R Package for Fitting the Multinomial Probit Model |
| modeltools | Tools and Classes for Statistical Models |
| mombf | Moment and Inverse Moment Bayes factors |
| monomvn | Estimation for multivariate normal and Student-t data with monotone missingness |
| monreg | Nonparametric monotone regression |
| mosaic | Project MOSAIC (mosaic-web.org) statistics and mathematics teaching utilities |
| MSBVAR | Markov-Switching, Bayesian, Vector Autoregression Models |
| msm | Multi-state Markov and hidden Markov models in continuous time |
| multcomp | Simultaneous Inference in General Parametric Models |
| multicool | Permutations of multisets in cool-lex order. |
| munsell | Munsell colour system |
| mvoutlier | Multivariate outlier detection based on robust methods |
| mvtnorm | Multivariate Normal and t Distributions |
| ncvreg | Regularization paths for SCAD- and MCP-penalized regression models |
| nlme | Linear and Nonlinear Mixed Effects Models |
| NLP | Natural Language Processing Infrastructure |
| nnet | Feed-forward Neural Networks and Multinomial Log-Linear Models |
| numbers | Number-theoretic Functions |
| numDeriv | Accurate Numerical Derivatives |
| openNLP | Apache OpenNLP Tools Interface |
| openNLPdata | Apache OpenNLP Jars and Basic English Language Models |
| OutlierDC | Outlier Detection using quantile regression for Censored Data |
| OutlierDM | Outlier detection for replicated high-throughput data |
| outliers | Tests for outliers |
| pacbpred | PAC-Bayesian Estimation and Prediction in Sparse Additive Models |
| parallel | Support for Parallel computation in R |
| partitions | Additive partitions of integers |
| party | A Laboratory for Recursive Partytioning |
| PAWL | Implementation of the PAWL algorithm |
| pbivnorm | Vectorized Bivariate Normal CDF |
| pcaPP | Robust PCA by Projection Pursuit |
| permute | Functions for generating restricted permutations of data |
| pls | Partial Least Squares and Principal Component regression |
| plyr | Tools for splitting, applying and combining data |
| png | Read and write PNG images |
| polynom | A collection of functions to implement a class for univariate polynomial manipulations |
| PottsUtils | Utility Functions of the Potts Models |
| predmixcor | Classification rule based on Bayesian mixture models with feature selection bias corrected |
| PresenceAbsence | Presence-Absence Model Evaluation |
| prodlim | Product-limit estimation. Kaplan-Meier and Aalen-Johansson method for censored event history (survival) analysis |
| profdpm | Profile Dirichlet Process Mixtures |
| profileModel | Tools for profiling inference functions for various model classes |
| proto | Prototype object-based programming |
| pscl | Political Science Computational Laboratory, Stanford University |
| psych | Procedures for Psychological, Psychometric, and Personality Research |
| quadprog | Functions to solve quadratic programming problems |
| quantreg | Quantile Regression |
| qvcalc | Quasi variances for factor effects in statistical models |
| R.matlab | Read and write of MAT files together with R-to-MATLAB connectivity |
| R.methodsS3 | Utility function for defining S3 methods |
| R.oo | R object-oriented programming with or without references |
| R.utils | Various programming utilities |
| R2HTML | HTML exportation for R objects |
| R2jags | A Package for Running jags from R |
| R2OpenBUGS | Running OpenBUGS from R |
| R2WinBUGS | Running WinBUGS and OpenBUGS from R / S-PLUS |
| ramps | Bayesian Geostatistical Modeling with RAMPS |
| RandomFields | Simulation and Analysis of Random Fields |
| randomForest | Breiman and Cutler's random forests for classification and regression |
| RArcInfo | Functions to import data from Arc/Info V7.x binary coverages |
| raster | raster: Geographic data analysis and modeling |
| rbugs | Fusing R and OpenBugs and Beyond |
| RColorBrewer | ColorBrewer palettes |
| Rcpp | Seamless R and C++ Integration |
| RcppArmadillo | Rcpp integration for Armadillo templated linear algebra library |
| rcppbugs | R binding for cppbugs |
| RcppEigen | Rcpp integration for the Eigen templated linear algebra library |
| RcppExamples | Examples using Rcpp to interface R and C++ |
| RCurl | General network (HTTP/FTP/...) client interface for R |
| relimp | Relative Contribution of Effects in a Regression Model |
| reshape | Flexibly reshape data |
| reshape2 | Flexibly reshape data: a reboot of the reshape package |
| rgdal | Bindings for the Geospatial Data Abstraction Library |
| rgeos | Interface to Geometry Engine - Open Source (GEOS) |
| rgl | 3D visualization device system (OpenGL) |
| RGraphics | Data and Functions from the book R Graphics, Second Edition |
| RGtk2 | R bindings for Gtk 2.8.0 and above |
| RJaCGH | Reversible Jump MCMC for the analysis of CGH arrays |
| rjags | Bayesian graphical models using MCMC |
| rJava | Low-level R to Java interface |
| RJSONIO | Serialize R objects to JSON, JavaScript Object Notation |
| robCompositions | Robust Estimation for Compositional Data |
| robustbase | Basic Robust Statistics |
| RODBC | ODBC Database Access |
| rootSolve | Nonlinear root finding, equilibrium and steady-state analysis of ordinary differential equations |
| roxygen | Literate Programming in R |
| roxygen2 | In-source documentation for R |
| rpart | Recursive Partitioning and Regression Trees |
| rrcov | Scalable Robust Estimators with High Breakdown Point |
| rscproxy | statconn: provides portable C-style interface to R (StatConnector) |
| RSGHB | Functions for Hierarchical Bayesian Estimation: A Flexible Approach |
| RSNNS | Neural Networks in R using the Stuttgart Neural Network Simulator (SNNS) |
| RTextTools | Automatic Text Classification via Supervised Learning |
| RUnit | R Unit test framework |
| runjags | Interface utilities, parallel computing methods and additional distributions for MCMC models in JAGS |
| Runuran | R interface to the UNU.RAN random variate generators |
| rworldmap | Mapping global data, vector and raster |
| rworldxtra | Country boundaries at high resolution |


###R modules beginning with S through Z

| Package name | Package description |
| ------------ | ------------------- |
| SampleSizeMeans | Sample size calculations for normal means |
| SampleSizeProportions | Calculating sample size requirements when estimating the difference between two binomial proportions |
| sandwich | Robust Covariance Matrix Estimators |
| sbgcop | Semiparametric Bayesian Gaussian copula estimation and imputation |
| scales | Scale functions for graphics |
| scapeMCMC | MCMC Diagnostic Plots |
| scatterplot3d | 3D Scatter Plot |
| sciplot | Scientific Graphing Functions for Factorial Designs |
| segmented | Segmented relationships in regression models with breakpoints/changepoints estimation |
| sem | Structural Equation Models |
| seriation | Infrastructure for seriation |
| setRNG | Set (Normal) Random Number Generator and Seed |
| sgeostat | An Object-oriented Framework for Geostatistical Modeling in S+ |
| shapefiles | Read and Write ESRI Shapefiles |
| shiny | Web Application Framework for R |
| SimpleTable | Bayesian Inference and Sensitivity Analysis for Causal Effects from 2 x 2 and 2 x 2 x K Tables in the Presence of Unmeasured Confounding |
| slam | Sparse Lightweight Arrays and Matrices |
| smoothSurv | Survival Regression with Smoothed Error Distribution |
| sna | Tools for Social Network Analysis |
| snow | Simple Network of Workstations |
| SnowballC | Snowball stemmers based on the C libstemmer UTF-8 library |
| snowFT | Fault Tolerant Simple Network of Workstations |
| sp | classes and methods for spatial data |
| spacetime | classes and methods for spatio-temporal data |
| SparseM | Sparse Linear Algebra |
| spatial | Functions for Kriging and Point Pattern Analysis |
| spBayes | Univariate and Multivariate Spatial-temporal Modeling |
| spdep | Spatial dependence: weighting schemes, statistics and models |
| spikeslab | Prediction and variable selection using spike and slab regression |
| splancs | Spatial and Space-Time Point Pattern Analysis |
| splines | Regression Spline Functions and Classes |
| spTimer | Spatio-Temporal Bayesian Modelling Using R |
| stats | The R Stats Package |
| stats4 | Statistical Functions using S4 Classes |
| stochvol | Efficient Bayesian Inference for Stochastic Volatility (SV) Models |
| stringr | Make it easier to work with strings |
| strucchange | Testing, Monitoring, and Dating Structural Changes |
| stsm | Structural Time Series Models |
| stsm.class | Class and Methods for Structural Time Series Models |
| SuppDists | Supplementary distributions |
| survival | Survival Analysis |
| svmpath | svmpath: the SVM Path algorithm |
| tau | Text Analysis Utilities |
| tcltk | Tcl/Tk Interface |
| tcltk2 | Tcl/Tk Additions |
| TeachingDemos | Demonstrations for teaching and learning |
| tensorA | Advanced tensors arithmetic with named indices |
| testthat | Testthat code. Tools to make testing fun |
| textcat | N-Gram Based Text Categorization |
| textir | Inverse Regression for Text Analysis |
| tfplot | Time Frame User Utilities |
| tframe | Time Frame coding kernel |
| tgp | Bayesian treed Gaussian process models |
| TH.data | TH's Data Archive |
| timeDate | Rmetrics - Chronological and Calendar Objects |
| tm | Text Mining Package |
| tools | Tools for Package Development |
| translations | The R Translations Package |
| tree | Classification and regression trees |
| tseries | Time series analysis and computational finance |
| tsfa | Time Series Factor Analysis |
| tsoutliers | Automatic Detection of Outliers in Time Series |
| TSP | Traveling Salesperson Problem (TSP) |
| UsingR | Data sets for the text Using R for Introductory Statistics |
| utils | The R Utils Package |
| varSelectIP | Objective Bayes Model Selection |
| vcd | Visualizing Categorical Data |
| vegan | Community Ecology Package |
| VGAM | Vector Generalized Linear and Additive Models |
| VIF | VIF Regression: A Fast Regression Algorithm For Large Data |
| whisker | {{mustache}} for R, logicless templating |
| wordcloud | Word Clouds |
| XLConnect | Excel Connector for R |
| XML | Tools for parsing and generating XML within R and S-Plus |
| xtable | Export tables to LaTeX or HTML |
| xts | eXtensible Time Series |
| yaml | Methods to convert R data to YAML and back |
| zic | Bayesian Inference for Zero-Inflated Count Models |
| zipfR | Statistical models for word frequency distributions |
| zoo | S3 Infrastructure for Regular and Irregular Time Series (Z's ordered observations) |


<!-- Module References -->
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[convert-to-csv]: https://msdn.microsoft.com/library/azure/faa6ba63-383c-4086-ba58-7abf26b85814/
