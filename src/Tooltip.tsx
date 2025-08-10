import { Point2D } from "./Types";
import { clientCordConv, countChar, firstLayer } from "./Helpers";
import { frontConf } from "./Globals";
import { conf } from "./Conf";
import { requestRerender } from "./Rerender";

export const initTooltip = () => {
  let tooltip = document.createElement("div");

  tooltip.style.position = "absolute";
  tooltip.style.background = "rgba(0,0,0,0.7)";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.pointerEvents = "none";
  tooltip.style.display = "block";
  tooltip.style.borderRadius = "5px";
  document.body.appendChild(tooltip);

  window.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
  });
  window.addEventListener(
    "mousemove",
    (event) => {
      if ((event.target as any).tagName.toLowerCase() === "canvas") {
        tooltip.style.left = event.clientX + 10 + "px";
        tooltip.style.top = event.clientY + 10 + "px";
        tooltip.style.display = "block";
        const uv: Point2D = clientCordConv(event.clientX, event.clientY, conf);
        window.requestAnimationFrame(() => {
          const [u, st] = firstLayer(uv, conf);
          tooltip.innerHTML = `(${uv[0].toFixed(3)},${uv[1].toFixed(3)})<br>${u[0].toFixed(3)}:${u[1].toFixed(3)}<br>${st[0]}:${st[1]}<br>${countChar(st[0], "1")}:${countChar(st[1], "1")}`;

          if (frontConf.autoShowLeft) {
            conf.colorWithNumSpikes[0] = st[0].split("1").length - 1;
            conf.colorWithSpikeTrain[0] = Number("0b" + st[0]);
          }
          if (frontConf.autoShowRight) {
            conf.colorWithNumSpikes[1] = st[1].split("1").length - 1;
            conf.colorWithSpikeTrain[1] = Number("0b" + st[1]);
          }
          if (frontConf.autoShowLeft || frontConf.autoShowRight) {
            requestRerender();
          }
        });
      } else {
        tooltip.style.display = "none";
      }
    },
    false,
  );
};
