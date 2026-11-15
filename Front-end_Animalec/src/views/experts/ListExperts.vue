<template>
  <section class="page-section" aria-labelledby="titulo-experts">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" titleId="titulo-experts" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <nav aria-label="Ações de especialistas">
            <router-link
              :to="{name:'addExpert'}"
              tag="button"
              class="btn btn-outline-success mr-2 mt-2"
            >
              <i class="fas fa-plus-square" aria-hidden="true"></i> ADICIONAR ESPECIALISTA
            </router-link>
            <router-link :to="{name:'admin'}" tag="button" class="btn btn-outline-info mr-2 mt-2">
              <i class="fas fa-bars" aria-hidden="true"></i> MENU PRINCIPAL
            </router-link>
          </nav>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABLE-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <div class="table-responsive">
          <table class="table table-striped">
            <caption class="sr-only">Lista de especialistas e respetivas especializações</caption>
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  NOME
                  <i
                    class="fas fa-arrow-up"
                    v-if="sortType===1"
                    @click="sort()"
                    @keyup.enter="sort()"
                    role="button"
                    tabindex="0"
                    aria-label="Ordenar por nome"
                  ></i>
                  <i
                    class="fas fa-arrow-down"
                    v-else
                    @click="sort()"
                    @keyup.enter="sort()"
                    role="button"
                    tabindex="0"
                    aria-label="Ordenar por nome"
                  ></i>
                </th>
                <th scope="col">INSTITUIÇÃO</th>
                <th scope="col">ESPECIALIZAÇÃO</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expert of experts" :key="expert._id">
                <td class="pt-4">{{expert.name}}</td>
                <td class="pt-4">{{expert.institution}}</td>
                <td class="pt-4">{{specialization(expert)}}</td>
                <td>
                  <router-link
                    :to="{name:'editExpert', params:{expertId: expert._id}}"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit" aria-hidden="true"></i> EDITAR
                  </router-link>
                  <button
                    @click="viewExpert(expert)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i> VER
                  </button>
                  <button
                    @click="removeExpert(expert._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt" aria-hidden="true"></i> REMOVER
                  </button>
                </td>
              </tr>
              <tr v-if="experts.length === 0">
                <td colspan="4" class="text-center">Ainda não há especialistas.</td>
              </tr>
            </tbody>
          </table>
          </div>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--DETALHE-->
      <b-modal id="expert-detail" :title="selected ? selected.name : ''" ok-only ok-title="FECHAR">
        <dl v-if="selected">
          <dt>Estado</dt>
          <dd>{{selected.active ? "Ativo" : "Inativo"}}</dd>
          <dt>Título</dt>
          <dd>{{selected.title || "—"}}</dd>
          <dt>Instituição</dt>
          <dd>{{selected.institution || "—"}}</dd>
          <dt>Email</dt>
          <dd>{{selected.email}}</dd>
          <dt>Website</dt>
          <dd>{{selected.website || "—"}}</dd>
          <dt>Biografia</dt>
          <dd>{{selected.bio || "—"}}</dd>
          <dt>Especialização</dt>
          <dd>{{specialization(selected)}}</dd>
        </dl>
      </b-modal>
    </b-container>
  </section>
</template>

<script>
import { FETCH_EXPERTS, REMOVE_EXPERT } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";
import { groupLabel } from "@/utils/labels";

export default {
  name: "ManageExperts",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      experts: [],
      selected: null,
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("expert", ["getExperts", "getMessage"])
  },
  methods: {
    groupLabel,
    fetchExperts() {
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(
        () => {
          this.experts = this.getExperts;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sort() {
      this.experts.sort(this.compareNames);
      this.sortType = -this.sortType;
    },
    compareNames(a, b) {
      return this.sortType * a.name.localeCompare(b.name, "pt");
    },
    // Ex.: "Grupos: ave, peixe · Animais (2): Águia, Salmão"
    specialization(expert) {
      const parts = [];
      const groups = expert.specialization.groups;
      const names = expert.specialization.animals.map(animal => animal.name);
      if (groups.length) parts.push(`Grupos: ${groups.map(groupLabel).join(", ")}`);
      if (names.length) parts.push(`Animais (${names.length}): ${names.join(", ")}`);
      return parts.join(" · ");
    },
    viewExpert(expert) {
      this.selected = expert;
      this.$bvModal.show("expert-detail");
    },
    removeExpert(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o especialista?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`expert/${REMOVE_EXPERT}`, id).then(
            () => {
              this.$alert(this.getMessage, "Especialista removido!", "success");
              this.fetchExperts();
            },
            err => {
              this.$alert(`${err.message}`, "Erro", "error");
            }
          );
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchExperts();
  }
};
</script>
