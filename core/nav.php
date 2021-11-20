<?php
    $uri = $_SERVER['REQUEST_URI'];

    if($uri != "/" AND $uri != "index.php"){
        $uri = "https://maticmike.club/";
    }
?>
<div class="flyout-menu">
        <div class="flyout-menu-header">
            <a class="flyout-menu-logo" href="https://maticmike.club"
                title="Matic Mike is the new kid on the Polygon Block. High utility NFT with custom ERC20 token.">
                <picture class="img img-fluid" loading="lazy">
                    <source type="image/webp" srcset="dist/img/logo.webp">
                    <img width="274" height="101" class="img img-fluid" src="dist/img/logo.png"
                        alt="Matic Mike is the new kid on the Polygon Block.">
                </picture>
            </a>
            <a href="#" class="flyout-menu-close icon-close js-flyout-close" aria-label="Close Side Menu">
                <i class="fas fa-times"></i>
            </a>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                    <div id="main-menu" class="list-group">
                        <a href="#roadmap" class="list-group-item scroll-to text-uppercase"><i class="far fa-road"></i> ROADMAP</a>
                        <a href="#team" class="list-group-item scroll-to text-uppercase"><i class="fas fa-layer-group"></i> Matic Mike Devs</a>
                        <a aria-label="Guide" class="list-group-item dropdown-toggle text-uppercase" role="button" data-bs-toggle="collapse" data-bs-target="#sideGuideCollapse" aria-expanded="false" aria-controls="sideGuideCollapse">
                            <i class="far fa-info-square"></i> Guide
                        </a>
                        <ul id="sideGuideCollapse" class="collapse" aria-labelledby="sideGuide">
                            <li><a class="dropdown-item" href="#">How to Set Up Polygon</a></li>
                            <li><a class="dropdown-item" href="#">Minting Your Mike</a></li>
                            <li><a class="dropdown-item" href="#">Sending Mike to the Gym</a></li>
                            <li><a class="dropdown-item" href="#">Dance Off (coming soon)</a></li>
                        </ul>
                        <a aria-label="Contracts" class="list-group-item dropdown-toggle text-uppercase" role="button" data-bs-toggle="collapse" data-bs-target="#sideContractsCollapse" aria-expanded="false" aria-controls="sideContractsCollapse">
                            <i class="fak fa-matic"></i> View Contracts
                        </a>
                        <ul id="sideContractsCollapse" class="collapse" aria-labelledby="sideGuide">
                            <li><a class="dropdown-item" href="#">Matic Mike Contract</a></li>
                            <li><a class="dropdown-item" href="#">$HGH Contract</a></li>
                        </ul>
                        <a href="#" target="_blank" class="list-group-item scroll-to text-uppercase"><i class="far fa-dumbbell"></i> HIT THE GYM (STAKE)</a>
                        
                        <a href="#" target="_blank" class="list-group-item scroll-to text-uppercase"><i class="far fa-fist-raised"></i> Upgrade Mike</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid btn-container">
            <div class="container-fluid btn-container">
                <div class="row justify-content-center pt-3">
                    <div class="col-12 text-center">
                        <a href="<?php echo $uri; ?>#mint" class="btn btn-primary scroll-to btn-block text-center"
                            title="Mint your NFT Now!"><i class="fab fa-ethereum" aria-hidden="true"></i> MINT NFT
                            NOW</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid">
            <div class="row justify-content-center mt-3">
                <div class="col-12">
                    <ul class="nav justify-content-center footer-nav icon-nav">

                        <li class="nav-item">
                            <a class="nav-link" rel="noreferrer" href="https://twitter.com/MaticMikeNFT"
                                aria-label="Follow Matic Mike on Twitter">
                                <i class="fab fa-twitter" aria-hidden="true"></i>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" rel="noreferrer" href="https://discord.gg/5ARhBKsb"
                            target="_blank" aria-label="Join Matic Mike on Discord">
                                <i class="fab fa-discord" aria-hidden="true"></i>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" rel="noreferrer" href="https://opensea.io/collection/maticmike" aria-label="Buy/Sell/Trade Matic Mike on Opensea">
                                <i class="fak fa-opensea"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <header class="site-header">
        <div class="container site-header-inner">
        <div class="row flex-nav">
            <div class="col-12">
                <ul class="nav nav-pills justify-content-end">
                    <li class="nav-item btn-connect"><a class="nav-link" href="#"><i class="far fa-wallet"></i> Connect Wallet</a></li>
                    <li class="nav-item dropdown">
                        <a aria-label="Contracts" class="nav-link cart-btn" role="button" id="dropdownContracts" data-bs-toggle="dropdown" aria-expanded="false" href="#">
                            <i class="fak fa-matic" aria-hidden="true"></i> View Contracts
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dropdownContracts">
                            <li><a class="dropdown-item" href="#">Matic Mike NFT</a></li>
                            <li><a class="dropdown-item" href="#">$HGH Coin</a></li>
                            <li><a class="dropdown-item" href="#">XXL Contract (coming soon)</a></li>
                            <li><a class="dropdown-item" href="#">Dance Off Contract (coming soon)</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link menu-toggle" href="#"><i class="fas fa-bars"></i> Main Menu</a></li>
                </ul>
            </div>
        </div>
                
            <div class="row main-nav">
                <div class="col-12 nopadding">
                    <div id="navbar-header" class="navbar-header">
                        <div class="donate-mobile">

                            <a href="<?php echo $uri; ?>#mint" title="Mint a Matic Mike NFT For Free">
                                <div class="container-fluid icon-button mobile justify-content-center">
                                    <div class="row">
                                        <div class="col-12 text-center">
                                            <picture class="img img-fluid" loading="lazy">
                                                <source type="image/webp" srcset="dist/img/icon.webp">
                                                <img width="89" height="47" alt="Mint a Matic Mike Now"
                                                    src="dist/img/icon.png" loading="lazy">
                                            </picture>
                                        </div>
                                    </div>
                                    <div class="row mt-1">
                                        <div class="col-12 text-center">
                                            MINT MIKE
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <button type="button" class="navbar-toggler navbar-mobile menu-toggle" aria-label="main menu">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>

                        <a class="home" href="https://maticmike.club">
                            <picture class="img img-fluid" loading="lazy" class="img img-fluid float-left">
                                <source type="image/webp" srcset="dist/img/logo.webp">
                                <img height="75" width="204" src="dist/img/logo.png" style="max-height:75px;"
                                    alt="Matic Mike NFT">
                            </picture>
                        </a>
                    </div>
                    <div class="navbar navbar-main hidden-max-1000">
                        <ul class="nav justify-content-end hidden-max-768">
                            <li class="nav-item text-uppercase"><a class="nav-link" href="<?php echo $uri; ?>#roadmap"><i class="far fa-road" aria-hidden="true"></i> Roadmap</a>
                            </li>
                            <li class="nav-item text-uppercase"><a class="nav-link" href="<?php echo $uri; ?>#team"><i class="fas fa-layer-group" aria-hidden="true"></i> Devs</a>
                            </li>
                            <li class="nav-item text-uppercase">
                                <a aria-label="Contracts" class="nav-link cart-btn" role="button" id="dropdownGuide" data-bs-toggle="dropdown" aria-expanded="false" href="#">
                                    <i class="far fa-info-square" aria-hidden="true"></i> Guide
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="dropdownGuide">
                                    <li><a class="dropdown-item" href="#">How to Set Up Polygon</a></li>
                                    <li><a class="dropdown-item" href="#">Minting Your Mike</a></li>
                                    <li><a class="dropdown-item" href="#">Sending Mike to the Gym</a></li>
                                    <li><a class="dropdown-item" href="#">Dance Off Contract (coming soon)</a></li>
                                </ul>
                            </li>
                            <li class="nav-item"><a class="donate-color nav-link donate-button" href="<?php echo $uri; ?>#mint">
                                    <div class="container-fluid icon-button justify-content-center">
                                        <div class="row">
                                            <div class="col-12 text-center">
                                                <picture class="img img-fluid" loading="lazy">
                                                    <source type="image/webp" srcset="dist/img/icon.webp">
                                                    <img width="89" height="47" alt="Mint a Matic Mike NFT"
                                                        src="dist/img/icon.png" loading="lazy">
                                                </picture>
                                            </div>
                                        </div>
                                        <div class="row mt-1">
                                            <div class="col-12 text-center">
                                                Mint NFT
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>