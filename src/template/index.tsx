import type { FC } from "hono/jsx";
import { Layout } from "./_layout.js";

const index: FC = () => {
  return (
    <Layout
      title="App"
    >
      <div>
        <input type="text" id="room-input" placeholder="Enter Room" class="input input-bordered w-full max-w-xs" />
        <button id="join-button" class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Join</button>
        <button id="create-button" class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Create</button>
      </div>

      <script src="/static/index.js" />
    </Layout>
  );
}

export const indexTemplates = {
  index,
};
