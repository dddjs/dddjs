import { UIMaterial } from "./UIMaterial";
import { ShaderChunk } from "./chunks/ShaderChunk";
import { GLTools } from "../tools/GLTools";
import { ImagesLoaded } from "../tools/ImagesLoaded";
import { UIScene } from "../ui/UIScene";


export class UIMultiTexturesMaterial extends UIMaterial {
  // image map

  constructor(config: object) {
    super(config)

    this.config = {
      // color: null,
      texture0: null,
      texture1: null,
      ...this.config
    }
  }

  shaderSource(scene: UIScene) {
    let vert = `
    attribute vec2 textCoord;
    varying   vec4 vColor;
    varying vec2 v_TexCoord;`,
      vertMain = `
      v_TexCoord = textCoord; 
      `,
      frag = `
      uniform sampler2D texture0;
      uniform sampler2D texture1;
    varying vec2 v_TexCoord;`,
      fragMain = `
      vec4 smpColor0 = texture2D(texture0, v_TexCoord);
      vec4 smpColor1 = texture2D(texture1, v_TexCoord);
      gl_FragColor   = smpColor1 * smpColor0;
      `;

    this.shader = new ShaderChunk(scene, vert, vertMain, frag, fragMain)
  }

  handle() {
    new ImagesLoaded([this.config['texture0'], this.config['texture1']]).onLoad((images) => {
      let texture0 = GLTools.createTexture(this.ctx, images[0], { unit: 0 });
      let texture1 = GLTools.createTexture(this.ctx, images[1], { unit: 1 });

      this.config['texture0'] = texture0;
      this.config['texture1'] = texture1;
      this.isReady = true;
    })

  }
}