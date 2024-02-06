import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join } from "path";

const SAVED_DATAS_PATH = "temp";

const removeOldMocks = (directory: string) => {
  try {
    rmSync("mocks", { recursive: true, force: true });
    console.log(`Папка ${directory} очищена.`);
  } catch (error) {
    console.error(`Ошибка при очистке папки ${directory}:`, error);
  }
};

function importSavedData(directory: string) {
  removeOldMocks(directory);

  const files = readdirSync(directory);
  const savedUrls = new Set();

  files.forEach((file) => {
    try {
      const fullPath = join(directory, file);
      const fileStat = statSync(fullPath);
      if (!fileStat.isFile() || !file.endsWith(".json")) {
        return;
      }

      const content = readFileSync(fullPath, "utf-8");
      const json = JSON.parse(content);
      if (!json.path || savedUrls.has(json.path)) {
        return;
      }

      savedUrls.add(json.path);

      if (json.method && json.path && json.body) {
        const newPath = `mocks${json.path}/${json.method}.json`;
        const dir = dirname(newPath);
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        writeFileSync(newPath, json.body);
        console.log(`Файл создан: ${newPath}`);
      }
    } catch (error) {
      console.log(error);
    }
  });

  console.log("Обновление мокового сервера успешно завершено!");
}

importSavedData(SAVED_DATAS_PATH);
