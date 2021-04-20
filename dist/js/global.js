var doc = document;

/* Declaring variables */

var weatherEntry = doc.querySelectorAll(".dock__entry")[2],
  info = doc.querySelectorAll(".info"),
  dock = doc.querySelector(".dock"),
  r = doc.querySelector(":root"),
  flavor = doc.querySelector(".flavor--Default");

/* Function that runs when DOM is loaded */

function onload() {
  applyConfiguration();
  api.system.observeData(function (systemData) {
    loadTime(systemData);
  });
  api.weather.observeData(function (weatherData) {
    loadWeather(weatherData);
  });
  api.resources.observeData(function (resourcesData) {
    checkBattery(resourcesData);
  });
}

/* Time, Weather, & Battery functions */

function loadTime(systemData) {
  time.init({
    refresh: 10000,
    twentyfour: systemData.isTwentyFourHourTimeEnabled,
    callback: function (time) {
      info[1].innerHTML = `${time.dayText()}, ${time.monthText()} ${time.dateNth()}`;
    },
  });
}

function loadWeather(weatherData) {
  info[2].innerHTML = `${weatherData.now.temperature.current}&deg${weatherData.units.temperature} | ${weatherData.now.condition.description}`;
}

function checkBattery(resourceData) {
  var battState;
  if (resourceData.battery.state === 0) {
    battState = "unplugged";
  } else if (resourceData.battery.state === 1) {
    battState = "charging";
  } else {
    battState = "fully charged";
  }
  info[3].innerHTML = `${battState} ${resourceData.battery.percentage}%`;
}

/* Configuration function */

function applyConfiguration() {
  info[0].innerHTML = `hello, ${config.usr}`;
  if (config.switch_sysfont) {
    dock.style.fontFamily = "system-ui";
  }
  if (config.switch_hw) {
    weatherEntry.style.display = "none";
    dock.classList.toggle("hiddenWeather");
  }

  switch (window.innerHeight) {
    case 667:
    case 736:
      r.style.setProperty(
        "--adjustableHeight",
        `calc(30% + 2*${config["sl-ah"]}px)`
      );
      r.style.setProperty(
        "--noWeatherHeight",
        `calc(27.5% + 2*${config["sl-ah"]}px)`
      );
      break;
    default:
      r.style.setProperty(
        "--adjustableHeight",
        `calc(26% + 2.5*${config["sl-ah"]}px)`
      );
      r.style.setProperty(
        "--noWeatherHeight",
        `calc(23.5% + 2.5*${config["sl-ah"]}px)`
      );
      break;
  }
  const flavorPalette = [
    "--primaryAccent",
    "--secondaryAccent",
    "--tertiaryAccent",
    "--quarternaryAccent",
    "--dockColor",
    "--textColor",
  ];
  const flavorConfig = [
    config.gdc,
    config.ddc,
    config.wdc,
    config.bdc,
    config["c-bg"],
    config["c-text"],
  ];
  for (let index = 0; index < flavorPalette.length; index++) {
    flavor.style.setProperty(flavorPalette[index], flavorConfig[index]);
  }

  r.style.setProperty("--blur", `${config["sl-blur"]}px`);
  r.style.setProperty(
    "--borderRadius",
    `${config["sl-br"]}px ${config["sl-br"]}px 0 0`
  );
}
