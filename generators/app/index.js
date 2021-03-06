"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { resolve } = require("path");
const remote = require("yeoman-remote");
const yoHelper = require("@feizheng/yeoman-generator-helper");
const replace = require("replace-in-file");

module.exports = class extends Generator {
  initializing() {
    this.composeWith("@feizheng/dotfiles:stdapp");
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red(
          "generator-rollup-package"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "scope",
        message: "Your scope (eg: like this `@babel` )?",
        default: 'jswork'
      },
      {
        type: "input",
        name: "project_name",
        message: "Your project_name (eg: like this `react-button` )?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      }
    ];

    return this.prompt(prompts).then(
      (props) => {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props);
      }
    );
  }

  install() {
    this.npmInstall();
  }

  writing() {
    const done = this.async();
    remote(
      "afeiship",
      "boilerplate-rollup-package",
      (err, cachePath) => {
        // copy files:
        this.fs.copyTpl(
          glob.sync(resolve(cachePath, "{**,.*}")),
          this.destinationPath(),
          this.props
        );
        done();
      }
    );
  }

  end() {
    const { scope, project_name, description } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate-scope/g,
        /boilerplate-rollup-package-description/g,
        /boilerplate-rollup-package/g
      ],
      to: [scope, description, project_name]
    });
  }
};
