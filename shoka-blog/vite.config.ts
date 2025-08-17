import dayjs from "dayjs";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { createViteProxy, setupVitePlugins } from "./build";
import { oml2d } from "vite-plugin-oh-my-live2d";

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(
    configEnv.mode,
    process.cwd()
  ) as Env.ImportMeta;

  const buildTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      BUILD_TIME: JSON.stringify(buildTime),
    },
    plugins: [
      ...setupVitePlugins(viteEnv),
      oml2d({
        models: [
          {
            path: '/models/kobayaxi/model.json',
            position: [10, 10],
            scale: 0.14,
            style: { width: "500px" }
          },
          {
            path: 'https://registry.npmmirror.com/oml2d-models/latest/files/models/Pio/model.json',
            scale: 0.4,
            position: [0, 50],
            stageStyle: {
              height: 300
            }
          }
        ],
        tips: {
          style: {
            position: "absolute",
            fontSize: "15px",
            borderRadius: "10px",
            filter: "drop-shadow(0 0 5px #999)",
            border: "2px solid #fff",
            color: "#fff",
            padding: "3px 3px",
            opacity: 0,
            visibility: "hidden",
            transform: "translateX(-50%)",
            textAlign: "center",
            justifyContent: "center",
            animationDuration: "1000ms,1000ms",
            animationFillMode: "forwards, none",
            animationIterationCount: "1, infinite",
            width: "80%",
            left: "40%",
            top: "-20%",
            display: "flex",
            alignItems: "center",
            minHeight: "100px",
            zIndex: 10000,
            // 修复高度设置：
            height: "80px",  // 改为固定高度或百分比
          },
          idleTips: {
            wordTheDay: (wordTheDayData: any) => {
              return wordTheDayData.hitokoto;
            }
          }
        }
      }) 
    ], 
    server: {
      host: "0.0.0.0",
      port: 1314,
      open: true,
      proxy: createViteProxy(viteEnv),
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      outDir: viteEnv.VITE_DIST_NAME,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  };
});