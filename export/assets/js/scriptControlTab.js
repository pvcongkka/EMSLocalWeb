rcTabs8PanelESS = {
  id: "1",
  OperationMode: "1",
  ChargingPowerLimit: "1",
  MaxGridPower: "1",
  DischargingPowerLimit: "1",
  MiddleLoadPower: "1",
  BaseLoadPower: "1",
  EnableZeroExport: "1",
  EnableSystemclearDiagnostic: "1",
};
rcTabs8PanelBattery = {
  id: "1",
  DischargeCutoffSoc: "1",
  DischargeCutoffVolt: "1",
  ChargeCutoffSoc: "1",
  ChargeCutoffVolt: "1",
  DischargeCurrentLimit: "1",
  DischargingPowerLimitbat: "1",
  ChargeCurrentLimit: "1",
  ChargingPowerLimitbat: "1",
};
rcTabs8PanelInverter = {
  id: "1",
  Level1OverFreqProtTime: "1",
  Level2OverFreqProtTime: "1",
  Level1OverFreqProtValue: "1",
  Level2OverFreqProtValue: "1",
  Level1OverVoltProtTime: "1",
  Level2OverVoltProtTime: "1",
  Level1OverVoltProtValue: "1",
  Level2OverVoltProtValue: "1",
  Level1UnderFreqProtTime: "1",
  Level2UnderFreqProtTime: "1",
  Level1UnderFreqProtValue: "1",
  Level2UnderFreqProtValue: "1",
  Level1UnderVoltProtTime: "1",
  Level2UnderVoltProtTime: "1",
  Level1UnderVoltProtValue: "1",
  Level2UnderVoltProtValue: "1",
  DcCurrentLimit: "1",
  LongTimeOverVoltageProtectionTime: "1",
  DcDischargeCutOffVoltage: "1",
  LongTimeOverVoltageProtectionValue: "1",
};

rcTabs8PanelHVAC = {
  id: "1",
  HvacType: "1",
  StartCoolingCondition: "1",
  StartHeatingCondition: "1",
  StopCoolingCondition: "1",
  StopHeatingCondition: "1",
  CellTempDiffLv1: "1",
  CellTempDiffLv2: "1",
  CellTempDiffLv3: "1",
};
rcTabs8PanelSolar = {
  id: "1",
  EnableControlSystemRunning: "1",
  EnablePowerLimitationControl: "1",
  EnableExportPowerLimitationControl: "1",
  PowerLimitationRate: "1",
  ExportPowerLimitationRate: "1",
  PowerLimitationValue: "1",
  ExportPowerLimitationValue: "1",
  ReactivePowerAdjustmentMode: "1",
  PowerFactorSetting: "1",
  ReactivePowerLimitationRate: "1",
  EnableActivePowerOverload: "1",
  ReactivePowerLimitationValue: "1",
  EnableRemoteControl: "1",
};
document.addEventListener("DOMContentLoaded", function () {
  // JavaScript to switch between tabs

  const tabs = document.querySelectorAll('#div_control_tab .ant-tabs-tab-btn');
  const panels = document.querySelectorAll(
    `#div_control_tab .ant-tabs-tabpane`
  );

  if (tabs.length > 0 && panels.length > 0) {
    // Initially hide all panels except the first one
    panels.forEach((p, index) => {
      p.style.display = index === 0 ? "block" : "none"; // Show the first panel, hide others
    });

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Hide all panels
        panels.forEach((p) => {
          p.style.display = "none"; // Hide panel
        });

        // Show the panel corresponding to the clicked tab
        const panelId = this.getAttribute("aria-controls");
        const panel = document.getElementById(panelId);

        if (panel) {
          panel.style.display = "block"; // Show the corresponding panel
        } else {
          console.error(`Panel with id ${panelId} not found.`);
        }

        // Change display style for tabs
        tabs.forEach((t) => {
          t.classList.remove("ant-tabs-tab-btn-color-active"); // Remove active class
        });

        this.classList.add("ant-tabs-tab-btn-color-active"); // Add active class to the current tab
      });
    });
  } else {
    console.error("Tabs or panels not found.");
  }
  /*ESS Tab Scripts*/

  // Setup for each tab's input fields
  makeChangeConf("rc-tabs-8-panel-ESS", rcTabs8PanelESS);
  makeChangeConf("rc-tabs-8-panel-Battery", rcTabs8PanelBattery);
  makeChangeConf("rc-tabs-8-panel-Inverter", rcTabs8PanelInverter);
  makeChangeConf("rc-tabs-8-panel-HVAC", rcTabs8PanelHVAC);
  makeChangeConf("rc-tabs-8-panel-Solar", rcTabs8PanelSolar);
  makeChangeConf_timeUseSetting("rc-tabs-8-panel-TimeofUse");
});

/* Javascript Function */
function makeChangeConf(inputFieldId, data_Store) {
  // Declare a variable to store the original values
  let originalValues = [];

  document
    .querySelector(`#${inputFieldId} .makeChangebtn`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = this;

      // Store the original values of the input fields
      originalValues = Array.from(inputFields).map((input) => {
        // Check if the input is a checkbox
        if (input.tagName === "INPUT" && input.type === "checkbox") {
          // Return "ON" or "OFF" based on the state of the checkbox
          return input.checked ? "ON" : "OFF";
        }
        // Return the value for other inputs
        return input.value;
      });

      inputFields.forEach((input) => {
        if (input.tagName === "SELECT") {
          input.removeAttribute("disabled");
        } else if (input.tagName === "INPUT") {
          input.removeAttribute("readonly");
          if (input.type === "checkbox") {
            input.removeAttribute("disabled");
          } else {
            input.removeAttribute("readonly");
          }
        }
      });

      actionButtons.style.display = "block";
      openBtn.style.display = "none";
    });

  document
    .querySelector(`#${inputFieldId} .btn-cancel`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = document.querySelector(`#${inputFieldId} .makeChangebtn`);

      // Restore the original values of the input fields
      inputFields.forEach((input, index) => {
        if (input.type === "checkbox") {
          input.checked = originalValues[index] === "ON";
        } else {
          input.value = originalValues[index];
        }

        if (input.tagName === "SELECT") {
          input.setAttribute("disabled", true);
        } else if (input.tagName === "INPUT") {
          if (input.type === "checkbox") {
            input.setAttribute("disabled", true);
          } else {
            input.setAttribute("readonly", true);
          }
        }
      });

      actionButtons.style.display = "none";
      openBtn.style.display = "block";
    });

  document
    .querySelector(`#${inputFieldId} .btn-success`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = document.querySelector(`#${inputFieldId} .makeChangebtn`);
      // Set inputs to readonly after confirmation
      inputFields.forEach((input) => {
        if (input.tagName === "SELECT") {
          input.setAttribute("disabled", true);
        } else if (input.tagName === "INPUT") {
          if (input.type === "checkbox") {
            input.setAttribute("disabled", true);
          } else {
            input.setAttribute("readonly", true);
          }
        }
      });

      actionButtons.style.display = "none";
      openBtn.style.display = "block";
      // Show success message
      const message = document.getElementById("success-message");
      message.style.display = "block"; // Display the message

      // Fade out and hide the message after 2 seconds
      setTimeout(() => {
        message.style.opacity = "0"; // Fade out
        setTimeout(() => {
          message.style.display = "none"; // Hide after fading out
          message.style.opacity = "1"; // Reset opacity
        }, 1000); // Time to fade out
      }, 2000); // Show for 2 seconds
      // Get field names from data_Store
      const fieldNames = Object.keys(data_Store).filter((key) => key !== "id");
      // Create a new object to hold the mapped data
      const newData = { ...data_Store }; // Copy the existing data_Store
      // Map input fields values into newData using its keys
      Array.from(inputFields).forEach((input, index) => {
        if (index < fieldNames.length) {
          if (input.type === "checkbox") {
            newData[fieldNames[index]] = input.checked;
          } else {
            newData[fieldNames[index]] = input.value; // Update only for existing keys in data_Store
          }
        }
      });

      console.log(newData);
      fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newData }),
      })
        .then((response) => response.json())
        .then((newData) => {
          console.log("Success:", newData);
          // Show success message
          const message = document.getElementById("success-message");
          message.style.display = "block"; // Display the message

          // Fade out and hide the message after 2 seconds
          setTimeout(() => {
            message.style.opacity = "0"; // Fade out
            setTimeout(() => {
              message.style.display = "none"; // Hide after fading out
              message.style.opacity = "1"; // Reset opacity
            }, 1000); // Time to fade out
          }, 2000); // Show for 2 seconds
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
function makeChangeConf_ResetAllValue(inputFieldId) {
  const inputFields = document.querySelectorAll(
    `#${inputFieldId} input, #${inputFieldId} select`
  );
  const actionButtons = document.querySelector(
    `#${inputFieldId} .make-change-btns_cus`
  );
  const openBtn = document.querySelector(`#${inputFieldId} .makeChangebtn`);
  // Check if actionButtons and openBtn are not null
  if (!actionButtons || !openBtn) {
    return;
  }

  // Check if inputFields exist
  if (inputFields.length === 0) {
    return;
  }
  // Restore the original values of the input fields
  inputFields.forEach((input, index) => {
    // if (input.type === "checkbox") {
    //   input.checked = originalValues[index] === "ON";
    // } else {
    //   input.value = originalValues[index];
    // }

    if (input.tagName === "SELECT") {
      input.setAttribute("disabled", true);
    } else if (input.tagName === "INPUT") {
      if (input.type === "checkbox") {
        input.setAttribute("disabled", true);
      } else {
        input.setAttribute("readonly", true);
      }
    }
  });

  actionButtons.style.display = "none";
  openBtn.style.display = "block";
}
function makeChangeConf_timeUseSetting(inputFieldId) {
  let originalValues = [];

  document
    .querySelector(`#${inputFieldId} .makeChangebtn`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = this;
      const edit_time_btn = document.querySelectorAll(
        `#${inputFieldId} .edit-time`
      );
      edit_time_btn.forEach((link) => {
        link.style.display = "block";
      });

      actionButtons.style.display = "block";
      openBtn.style.display = "none";
    });

  document
    .querySelector(`#${inputFieldId} .btn-cancel`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = document.querySelector(`#${inputFieldId} .makeChangebtn`);

      // Restore the original values of the input fields
      const edit_time_btn = document.querySelectorAll(
        `#${inputFieldId} .edit-time`
      );
      edit_time_btn.forEach((link) => {
        link.style.display = "none"; // Hide the action links
      });

      actionButtons.style.display = "none";
      openBtn.style.display = "block";
    });

  document
    .querySelector(`#${inputFieldId} .btn-success`)
    .addEventListener("click", function () {
      const inputFields = document.querySelectorAll(
        `#${inputFieldId} input, #${inputFieldId} select`
      );
      const actionButtons = document.querySelector(
        `#${inputFieldId} .make-change-btns_cus`
      );
      const openBtn = document.querySelector(`#${inputFieldId} .makeChangebtn`);
      // Set inputs to readonly after confirmation
      const edit_time_btn = document.querySelectorAll(
        `#${inputFieldId} .edit-time`
      );
      edit_time_btn.forEach((link) => {
        link.style.display = "none"; // Hide the action links
      });
      actionButtons.style.display = "none";
      openBtn.style.display = "block";
    });
}

function getInput_rcTabs8PanelESSData(inputFieldId, data_Store) {
  rcTabs8PanelESS.id = "1";
  rcTabs8PanelESS.OperationMode = document.getElementById(
    "operation_mode_setting"
  ).value;
  rcTabs8PanelESS.ChargingPowerLimit = document.getElementById(
    "charging_power_limit"
  ).value;
  rcTabs8PanelESS.MaxGridPower =
    document.getElementById("max_grid_power").value;
  rcTabs8PanelESS.DischargingPowerLimit = document.getElementById(
    "discharging_power_limit"
  ).value;
  rcTabs8PanelESS.MiddleLoadPower =
    document.getElementById("middle_load_power").value;
  rcTabs8PanelESS.BaseLoadPower =
    document.getElementById("base_load_power").value;
  rcTabs8PanelESS.EnableZeroExport =
    document.getElementById("Enable_Zero_Export").value;
  rcTabs8PanelESS.EnableSystemclearDiagnostic = document.getElementById(
    "Enable_System_clear_Diagnostic"
  ).value;
}
function getInput_rcTabs8PanelBatteryData() {
  rcTabs8PanelBattery.id = "1";
  rcTabs8PanelBattery.DischargeCutoffSoc = document.getElementById(
    "discharge_cut_off_soc"
  ).value;
  rcTabs8PanelBattery.DischargeCutoffVolt = document.getElementById(
    "discharge_cut_off_volt"
  ).value;
  rcTabs8PanelBattery.ChargeCutoffSoc =
    document.getElementById("charge_cut_off_soc").value;
  rcTabs8PanelBattery.ChargeCutoffVolt = document.getElementById(
    "charge_cut_off_volt"
  ).value;
  rcTabs8PanelBattery.DischargeCurrentLimit =
    document.getElementById("discharge_current").value;
  rcTabs8PanelBattery.DischargingPowerLimitbat = document.getElementById(
    "bat_discharging_power_limit"
  ).value;
  rcTabs8PanelBattery.ChargeCurrentLimit =
    document.getElementById("charge_current").value;
  rcTabs8PanelBattery.ChargingPowerLimitbat = document.getElementById(
    "bat_charging_power_limit"
  ).value;
}
function getInput_rcTabs8PanelInverterData() {
  rcTabs8PanelInverter.id = "1";
  rcTabs8PanelInverter.Level1OverFreqProtTime = document.getElementById(
    "over_freq_prot_time_level1"
  ).value;
  rcTabs8PanelInverter.Level2OverFreqProtTime = document.getElementById(
    "over_freq_prot_time_level2"
  ).value;
  rcTabs8PanelInverter.Level1OverFreqProtValue = document.getElementById(
    "over_freq_prot_value_level1"
  ).value;
  rcTabs8PanelInverter.Level2OverFreqProtValue = document.getElementById(
    "over_freq_prot_value_level2"
  ).value;
  rcTabs8PanelInverter.Level1OverVoltProtTime = document.getElementById(
    "over_volt_prot_time_level1"
  ).value;
  rcTabs8PanelInverter.Level2OverVoltProtTime = document.getElementById(
    "over_volt_prot_time_level2"
  ).value;
  rcTabs8PanelInverter.Level1OverVoltProtValue = document.getElementById(
    "over_volt_prot_value_level1"
  ).value;
  rcTabs8PanelInverter.Level2OverVoltProtValue = document.getElementById(
    "over_volt_prot_value_level2"
  ).value;
  rcTabs8PanelInverter.Level1UnderFreqProtTime = document.getElementById(
    "under_freq_prot_time_level1"
  ).value;
  rcTabs8PanelInverter.Level2UnderFreqProtTime = document.getElementById(
    "under_freq_prot_time_level2"
  ).value;
  rcTabs8PanelInverter.Level1UnderFreqProtValue = document.getElementById(
    "under_freq_prot_value_level1"
  ).value;
  rcTabs8PanelInverter.Level2UnderFreqProtValue = document.getElementById(
    "under_freq_prot_value_level2"
  ).value;
  rcTabs8PanelInverter.Level1UnderVoltProtTime = document.getElementById(
    "under_volt_prot_time_level1"
  ).value;
  rcTabs8PanelInverter.Level2UnderVoltProtTime = document.getElementById(
    "under_volt_prot_time_level2"
  ).value;
  rcTabs8PanelInverter.Level1UnderVoltProtValue = document.getElementById(
    "under_volt_prot_value_level1"
  ).value;
  rcTabs8PanelInverter.Level2UnderVoltProtValue = document.getElementById(
    "under_volt_prot_value_level2"
  ).value;
  rcTabs8PanelInverter.DcCurrentLimit =
    document.getElementById("dc_current_limit").value;
  rcTabs8PanelInverter.LongTimeOverVoltageProtectionTime =
    document.getElementById("over_voltage_protection_time").value;
  rcTabs8PanelInverter.DcDischargeCutOffVoltage = document.getElementById(
    "dc_discharge_cut_off_volt"
  ).value;
  rcTabs8PanelInverter.LongTimeOverVoltageProtectionValue =
    document.getElementById("over_voltage_protection_value").value;
}

function getInput_rcTabs8PanelHVACData() {
  rcTabs8PanelHVAC.id = "1";
  rcTabs8PanelHVAC.HvacType = document.getElementById("hvac_type").value;
  rcTabs8PanelHVAC.StartCoolingCondition = document.getElementById(
    "start_cooling_conditional"
  ).value;
  rcTabs8PanelHVAC.StartHeatingCondition = document.getElementById(
    "start_heating_conditional"
  ).value;
  rcTabs8PanelHVAC.StopCoolingCondition = document.getElementById(
    "stop_cooling_conditional"
  ).value;
  rcTabs8PanelHVAC.StopHeatingCondition = document.getElementById(
    "stop_heating_conditional"
  ).value;
  rcTabs8PanelHVAC.CellTempDiffLv1 =
    document.getElementById("cell_temp_diff_lv1").value;
  rcTabs8PanelHVAC.CellTempDiffLv2 =
    document.getElementById("cell_temp_diff_lv2").value;
  rcTabs8PanelHVAC.CellTempDiffLv3 =
    document.getElementById("cell_temp_diff_lv3").value;
}
function getInput_rcTabs8PanelSolarData() {
  rcTabs8PanelSolar.id = "1";
  rcTabs8PanelSolar.EnableControlSystemRunning = document.getElementById(
    "Enable_Control_system_running"
  ).value;
  rcTabs8PanelSolar.EnablePowerLimitationControl = document.getElementById(
    "Enable_Power_limitation_control"
  ).value;
  rcTabs8PanelSolar.EnableExportPowerLimitationControl =
    document.getElementById("Enable-Export_Power_limitation_control").value;
  rcTabs8PanelSolar.PowerLimitationRate = document.getElementById(
    "power_limitation_rate"
  ).value;
  rcTabs8PanelSolar.ExportPowerLimitationRate = document.getElementById(
    "export_power_limitation_rate"
  ).value;
  rcTabs8PanelSolar.PowerLimitationValue = document.getElementById(
    "power_limitation_value"
  ).value;
  rcTabs8PanelSolar.ExportPowerLimitationValue = document.getElementById(
    "export_power_limitation_value"
  ).value;
  rcTabs8PanelSolar.ReactivePowerAdjustmentMode = document.getElementById(
    "Reactive_Power_Adjustment_mode"
  ).value;
  rcTabs8PanelSolar.PowerFactorSetting = document.getElementById(
    "power_factor_setting"
  ).value;
  rcTabs8PanelSolar.ReactivePowerLimitationRate = document.getElementById(
    "reactive_power_limitation_rate"
  ).value;
  rcTabs8PanelSolar.EnableActivePowerOverload = document.getElementById(
    "Enable_Active_power_overload"
  ).value;
  rcTabs8PanelSolar.ReactivePowerLimitationValue = document.getElementById(
    "reactive_power_limitation_value"
  ).value;
  rcTabs8PanelSolar.EnableRemoteControl = document.getElementById(
    "Enable_Remote_control"
  ).value;
}
